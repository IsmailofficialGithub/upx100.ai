import Stripe from 'stripe'
import * as stripeService from '../services/stripe.service.js'
import { supabaseAdmin } from '../config/supabase.js'
import { paymentQueue } from '../queues/payment.queue.js'
import { StatusCodes } from 'http-status-codes'
import pino from 'pino'
import {
  getCachedPackages,
  setCachedPackages,
  getCachedBillingStatus,
  setCachedBillingStatus
} from '../redis/billingCache.js'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

/**
 * Fetch all active subscription packages/tiers from the database
 */
export const getPackages = async (req, res, next) => {
  try {
    // 1. Try to fetch from Redis cache service
    const cached = await getCachedPackages()
    if (cached) {
      return res.json({ data: cached })
    }

    // 2. Fetch from Database
    const { data, error } = await supabaseAdmin
      .from('subscription_packages')
      .select('*')
      .eq('is_active', true)
      .order('amount_cents', { ascending: true })

    if (error) throw error

    // 3. Cache the results in Redis
    await setCachedPackages(data)

    return res.json({ data })
  } catch (err) {
    logger.error({ err }, 'Fetching subscription packages failed')
    next(err)
  }
}

/**
 * Initiate checkout session for a billing package
 */
export const checkout = async (req, res, next) => {
  try {
    const { packageId } = req.body
    if (!packageId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'MISSING_PACKAGE_ID', message: 'packageId is required' }
      })
    }

    const sessionUrl = await stripeService.createCheckoutSession({
      organizationId: req.user.orgId,
      packageId,
      customerEmail: req.user.email
    })

    return res.json({ data: { url: sessionUrl } })
  } catch (err) {
    logger.error({ err }, 'Checkout session generation failed')
    next(err)
  }
}

export const confirmCheckout = async (req, res, next) => {
  try {
    const { sessionId } = req.body
    if (!sessionId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'MISSING_SESSION_ID', message: 'sessionId is required' }
      })
    }

    const result = await stripeService.confirmCheckoutSession({
      organizationId: req.user.orgId,
      sessionId
    })

    return res.json({ data: result })
  } catch (err) {
    if (err.code === 'CHECKOUT_SESSION_FORBIDDEN') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: err.code, message: err.message }
      })
    }
    if (err.code === 'CHECKOUT_SESSION_INCOMPLETE') {
      return res.status(StatusCodes.CONFLICT).json({
        error: { code: err.code, message: err.message }
      })
    }
    logger.error({ err }, 'Checkout session confirmation failed')
    next(err)
  }
}

/**
 * Initiate customer billing portal session
 */
export const portal = async (req, res, next) => {
  try {
    const portalUrl = await stripeService.createPortalSession(req.user.orgId)
    return res.json({ data: { url: portalUrl } })
  } catch (err) {
    logger.error({ err }, 'Billing portal generation failed')
    next(err)
  }
}

/**
 * Fetch organization billing subscription and active package limits
 */
export const status = async (req, res, next) => {
  try {
    let orgId = req.user.orgId

    // Allow GCC Admins and Resellers/Partners to scope to a specific organization ID
    const userRole = req.user?.role
    const isGcc = userRole === 'gcc_admin' || userRole === 'gcc_reviewer'
    const isSp = userRole === 'sp_primary' || userRole === 'sp_sub'

    if ((isGcc || isSp) && req.query.orgId) {
      orgId = req.query.orgId
    }

    if (!orgId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'MISSING_ORG_ID', message: 'orgId is required' }
      })
    }

    // 1. Try to get from Redis cache service
    const cached = await getCachedBillingStatus(orgId)
    if (cached) {
      return res.json({ data: cached })
    }

    // 2. Fetch subscription details joined with package limits
    const { data: sub, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, package:subscription_packages(*)')
      .eq('organization_id', orgId)
      .maybeSingle()

    if (error) throw error

    // Fetch cached active card details
    const { data: card } = await supabaseAdmin
      .from('payment_methods')
      .select('card_brand, card_last4, card_exp_month, card_exp_year')
      .eq('organization_id', orgId)
      .eq('is_default', true)
      .maybeSingle()

    const result = {
      subscription: sub || null,
      payment_method: card || null
    }

    // 3. Cache the result in Redis
    await setCachedBillingStatus(orgId, result)

    return res.json({ data: result })
  } catch (err) {
    logger.error({ err }, 'Fetching billing status failed')
    next(err)
  }
}

/**
 * Fetch organization invoices / payment receipt history
 */
export const invoices = async (req, res, next) => {
  try {
    const orgId = req.user.orgId

    const { data: list, error } = await supabaseAdmin
      .from('billing_invoices')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.json({ data: list || [] })
  } catch (err) {
    logger.error({ err }, 'Fetching invoices failed')
    next(err)
  }
}

/**
 * Stripe Webhook Endpoint (Raw Body Parser)
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    logger.error('Missing stripe-signature header or STRIPE_WEBHOOK_SECRET environment config')
    return res.status(StatusCodes.BAD_REQUEST).send('Webhook Error: Missing configuration')
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    logger.error({ err }, 'Stripe webhook signature validation failed')
    return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`)
  }

  try {
    // 1. Check idempotency: Have we already enqueued/processed this event?
    const { data: existingLog, error: checkError } = await supabaseAdmin
      .from('stripe_webhook_logs')
      .select('id, status')
      .eq('stripe_event_id', event.id)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingLog) {
      logger.info({ eventId: event.id }, 'Stripe event already received, skipping duplicate')
      return res.json({ received: true, duplicate: true })
    }

    // 2. Save webhook event log to database as 'pending'
    const { error: logError } = await supabaseAdmin
      .from('stripe_webhook_logs')
      .insert([{
        stripe_event_id: event.id,
        event_type: event.type,
        payload: event,
        status: 'pending'
      }])

    if (logError) throw logError

    // 3. Add to background worker Redis queue for processing
    await paymentQueue.add('process-stripe-webhook', { event }, { jobId: event.id })
    logger.info({ eventId: event.id, eventType: event.type }, 'Stripe webhook event enqueued successfully')

    return res.json({ received: true })
  } catch (err) {
    logger.error({ err, eventId: event?.id }, 'Failed to record or queue Stripe webhook')
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Webhook Queue Failure')
  }
}
