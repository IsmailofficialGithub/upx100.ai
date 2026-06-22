import Stripe from 'stripe'
import { supabaseAdmin } from '../config/supabase.js'
import { clearOrgCache } from '../redis/billingCache.js'

// Initialize Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

const getFrontendUrl = () => {
  const configuredUrl = process.env.FRONTEND_URL?.trim()
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '')
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FRONTEND_URL is required in production')
  }
  return 'http://localhost:3000'
}

/**
 * Creates or retrieves a Stripe Customer for an Organization
 */
export const getOrCreateCustomer = async (organizationId, customerEmail) => {
  // Check if customer ID already exists in the database
  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('organization_id', organizationId)
    .maybeSingle()

  if (sub?.stripe_customer_id) {
    return sub.stripe_customer_id
  }

  // Fetch the organization details to get a name if email isn't provided
  let orgName = 'Organization'
  if (!customerEmail) {
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()
    if (org?.name) orgName = org.name
  }

  // Create Stripe Customer
  const customer = await stripe.customers.create({
    email: customerEmail || undefined,
    name: orgName,
    metadata: { organization_id: organizationId }
  }, {
    idempotencyKey: `cust-${organizationId}`
  })

  // Upsert the customer ID locally
  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      organization_id: organizationId,
      stripe_customer_id: customer.id,
      status: 'incomplete',
      updated_at: new Date().toISOString()
    }, { onConflict: 'organization_id' })

  if (upsertError) throw upsertError

  return customer.id
}

/**
 * Creates a Stripe Checkout Session for a specific package dynamic price
 */
export const createCheckoutSession = async ({ organizationId, packageId, customerEmail }) => {
  const frontendUrl = getFrontendUrl()

  // Fetch package details from database to get dynamic price and name
  const { data: pkg, error: pkgError } = await supabaseAdmin
    .from('subscription_packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) {
    throw new Error('Subscription package not found')
  }

  if (pkg.amount_cents === 0) {
    throw new Error('Cannot checkout Free tier using Stripe checkout')
  }

  // Retrieve or create Stripe customer token
  const stripeCustomerId = await getOrCreateCustomer(organizationId, customerEmail)

  // Generate checkout session with dynamic inline pricing from the database
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: pkg.currency || 'usd',
        product_data: {
          name: `${pkg.name} Plan`,
          description: pkg.description || `Subscription to ${pkg.name} plan`
        },
        unit_amount: pkg.amount_cents,
        recurring: {
          interval: pkg.interval || 'month'
        }
      },
      quantity: 1
    }],
    mode: 'subscription',
    success_url: `${frontendUrl}/client/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/client/billing?success=false`,
    client_reference_id: organizationId,
    metadata: {
      package_id: packageId
    },
    subscription_data: {
      metadata: {
        package_id: packageId
      }
    }
  }, {
    idempotencyKey: `checkout-${organizationId}-${packageId}-${Date.now()}`
  })

  return session.url
}

/**
 * Verify a completed Checkout Session and synchronize its subscription.
 * This gives the return page an immediate result while Stripe webhooks remain
 * the source of truth for later subscription lifecycle changes.
 */
export const confirmCheckoutSession = async ({ organizationId, sessionId }) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription']
  })

  if (session.client_reference_id !== organizationId) {
    const error = new Error('Checkout session does not belong to this organization')
    error.code = 'CHECKOUT_SESSION_FORBIDDEN'
    throw error
  }

  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    const error = new Error('Checkout payment is not complete')
    error.code = 'CHECKOUT_SESSION_INCOMPLETE'
    throw error
  }

  const subscription = typeof session.subscription === 'string'
    ? await stripe.subscriptions.retrieve(session.subscription)
    : session.subscription

  if (!subscription) {
    throw new Error('Stripe subscription was not returned for this Checkout Session')
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      organization_id: organizationId,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      stripe_price_id: subscription.items.data[0]?.price?.id || null,
      package_id: session.metadata?.package_id || null,
      current_period_start: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'organization_id' })

  if (error) throw error
  await clearOrgCache(organizationId)

  return { status: subscription.status }
}

/**
 * Creates a Stripe Billing Portal Session for subscription and payment card updates
 */
export const createPortalSession = async (organizationId) => {
  const frontendUrl = getFrontendUrl()
  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('organization_id', organizationId)
    .single()

  if (error || !sub?.stripe_customer_id) {
    throw new Error('Billing account not set up. Please subscribe to a package first.')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${frontendUrl}/client/billing`
  }, {
    idempotencyKey: `portal-${organizationId}-${Date.now()}`
  })

  return session.url
}
