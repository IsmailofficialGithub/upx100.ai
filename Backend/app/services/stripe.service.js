import Stripe from 'stripe'
import { supabaseAdmin } from '../config/supabase.js'

// Initialize Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

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
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?success=false`,
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
 * Creates a Stripe Billing Portal Session for subscription and payment card updates
 */
export const createPortalSession = async (organizationId) => {
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
    return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing`
  }, {
    idempotencyKey: `portal-${organizationId}-${Date.now()}`
  })

  return session.url
}
