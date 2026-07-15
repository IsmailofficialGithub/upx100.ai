import { Queue, Worker } from 'bullmq'
import { stripe } from '../config/stripe.js'
import { bullRedisConnection } from '../config/redis.js'
import { supabaseAdmin } from '../config/supabase.js'
import { clearOrgCache } from '../redis/billingCache.js'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

// Stripe client comes from shared config (supports org keys + Stripe-Context)

// Export Queue
export const paymentQueue = new Queue('payment-events', {
  connection: bullRedisConnection
})

// Define Workers
export const paymentWorker = new Worker(
  'payment-events',
  async (job) => {
    logger.info({ jobId: job.id, jobName: job.name }, 'Processing background payment job')

    switch (job.name) {
      case 'process-stripe-webhook': {
        const { event } = job.data
        try {
          await handleWebhookEvent(event)
          // Mark webhook event as processed in the audit log
          await supabaseAdmin
            .from('stripe_webhook_logs')
            .update({ status: 'processed', processed_at: new Date().toISOString() })
            .eq('stripe_event_id', event.id)
        } catch (err) {
          // Mark webhook event as failed in the audit log
          await supabaseAdmin
            .from('stripe_webhook_logs')
            .update({ status: 'failed', error_message: err.message })
            .eq('stripe_event_id', event.id)
          throw err // Re-throw so BullMQ marks the job as failed and schedules any retries
        }
        break
      }
      case 'send-payment-email': {
        const { email, amount, status, pdfUrl } = job.data
        await sendPaymentEmail(email, amount, status, pdfUrl)
        break
      }
      default:
        logger.warn({ jobName: job.name }, 'Unknown payment job type')
    }
  },
  {
    connection: bullRedisConnection,
    concurrency: 5 // Run up to 5 jobs in parallel
  }
)

paymentWorker.on('completed', (job) => {
  logger.info({ jobId: job.id, jobName: job.name }, 'Job completed successfully')
})

paymentWorker.on('failed', (job, err) => {
  logger.error({ jobId: job.id, jobName: job.name, err }, 'Job failed')
})

// ============================================================================
// Webhook Event Business Logic
// ============================================================================
async function handleWebhookEvent(event) {
  const dataObject = event.data.object

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = dataObject
      const organizationId = session.client_reference_id
      const customerId = session.customer
      const subscriptionId = session.subscription
      const packageId = session.metadata?.package_id

      if (!organizationId || !subscriptionId) {
        logger.error({ session }, 'Missing client_reference_id or subscription in checkout session')
        return
      }

      // Fetch latest subscription info from Stripe
      const sub = await stripe.subscriptions.retrieve(subscriptionId)

      // Upsert local subscription
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          organization_id: organizationId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: sub.status,
          stripe_price_id: sub.items.data[0].price.id,
          package_id: packageId || null,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'organization_id' })

      if (error) throw error
      await clearOrgCache(organizationId)
      logger.info({ organizationId, subscriptionId }, 'Successfully recorded completed subscription')
      break
    }

    case 'customer.subscription.updated': {
      const sub = dataObject
      const packageId = sub.metadata?.package_id

      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: sub.status,
          stripe_price_id: sub.items.data[0].price.id,
          package_id: packageId || null,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', sub.id)

      if (error) throw error
      const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('organization_id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()
      if (subData?.organization_id) {
        await clearOrgCache(subData.organization_id)
      }
      logger.info({ subscriptionId: sub.id }, 'Successfully updated subscription details')
      break
    }

    case 'customer.subscription.deleted': {
      const sub = dataObject

      // Fetch Free package to downgrade
      const { data: freePkg } = await supabaseAdmin
        .from('subscription_packages')
        .select('id')
        .eq('name', 'Free')
        .single()

      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          package_id: freePkg?.id || null,
          stripe_subscription_id: null,
          stripe_price_id: null,
          current_period_start: null,
          current_period_end: null,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', sub.id)

      if (error) throw error
      const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('organization_id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()
      if (subData?.organization_id) {
        await clearOrgCache(subData.organization_id)
      }
      logger.info({ subscriptionId: sub.id }, 'Successfully marked subscription as canceled/downgraded')
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = dataObject
      if (!invoice.customer) return

      // Lookup organization_id from active subscriptions
      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('organization_id')
        .eq('stripe_customer_id', invoice.customer)
        .single()

      if (subError || !subData) {
        logger.warn({ customer: invoice.customer }, 'Organization not found for Stripe customer')
        return
      }

      const { error } = await supabaseAdmin
        .from('billing_invoices')
        .upsert({
          organization_id: subData.organization_id,
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: invoice.subscription,
          stripe_charge_id: invoice.charge,
          amount_cents: invoice.amount_due,
          amount_paid_cents: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          billing_reason: invoice.billing_reason,
          invoice_pdf_url: invoice.hosted_invoice_url,
          paid_at: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'stripe_invoice_id' })

      if (error) throw error
      await clearOrgCache(subData.organization_id)
      
      // Enqueue invoice payment success email
      await paymentQueue.add('send-payment-email', {
        email: invoice.customer_email || invoice.billing_details?.email,
        amount: invoice.amount_paid / 100,
        status: 'success',
        pdfUrl: invoice.hosted_invoice_url
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = dataObject
      if (!invoice.customer) return

      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('organization_id')
        .eq('stripe_customer_id', invoice.customer)
        .single()

      if (subError || !subData) return

      const { error } = await supabaseAdmin
        .from('billing_invoices')
        .upsert({
          organization_id: subData.organization_id,
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: invoice.subscription,
          stripe_charge_id: invoice.charge,
          amount_cents: invoice.amount_due,
          amount_paid_cents: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          billing_reason: invoice.billing_reason,
          invoice_pdf_url: invoice.hosted_invoice_url,
          updated_at: new Date().toISOString()
        }, { onConflict: 'stripe_invoice_id' })

      if (error) throw error

      // Update subscription status locally to past_due
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', invoice.subscription)

      await clearOrgCache(subData.organization_id)

      // Enqueue invoice payment failed email
      await paymentQueue.add('send-payment-email', {
        email: invoice.customer_email || invoice.billing_details?.email,
        amount: invoice.amount_due / 100,
        status: 'failed'
      })
      break
    }

    case 'payment_method.attached': {
      const pm = dataObject
      if (!pm.customer) return

      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('organization_id')
        .eq('stripe_customer_id', pm.customer)
        .single()

      if (subError || !subData) return

      if (pm.card) {
        // Upsert payment card cache
        const { error } = await supabaseAdmin
          .from('payment_methods')
          .upsert({
            organization_id: subData.organization_id,
            stripe_payment_method_id: pm.id,
            card_brand: pm.card.brand,
            card_last4: pm.card.last4,
            card_exp_month: pm.card.exp_month,
            card_exp_year: pm.card.exp_year,
            is_default: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'stripe_payment_method_id' })

        if (error) throw error

        // Mark other payment methods as non-default
        await supabaseAdmin
          .from('payment_methods')
          .update({ is_default: false })
          .eq('organization_id', subData.organization_id)
          .neq('stripe_payment_method_id', pm.id)

        await clearOrgCache(subData.organization_id)
      }
      break
    }

    default:
      logger.info({ eventType: event.type }, 'Unhandled Stripe webhook event type')
  }
}

// ============================================================================
// Email Sending Notification Simulation
// ============================================================================
async function sendPaymentEmail(email, amount, status, pdfUrl) {
  if (!email) {
    logger.warn('Skipping email notification: no customer email address found')
    return
  }
  // Simulate mail sender delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (status === 'success') {
    logger.info(
      { email, amount, pdfUrl },
      `EMAIL SENT: Subscription payment of $${amount} succeeded. Receipt PDF: ${pdfUrl}`
    )
  } else {
    logger.error(
      { email, amount },
      `EMAIL SENT: Subscription payment of $${amount} failed. Please update your payment card.`
    )
  }
}
