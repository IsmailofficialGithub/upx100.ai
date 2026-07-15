import Stripe from 'stripe'

/**
 * Build a Stripe client. Organization API keys (sk_org_...) require Stripe-Context
 * identifying the target account: https://docs.stripe.com/keys/organization-api-keys
 *
 * Set either:
 *   STRIPE_CONTEXT=acct_...
 *   STRIPE_ACCOUNT_ID=acct_...
 */
export function createStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
  const stripeContext =
    process.env.STRIPE_CONTEXT?.trim() ||
    process.env.STRIPE_ACCOUNT_ID?.trim() ||
    undefined

  const isOrgKey = secretKey.startsWith('sk_org_') || secretKey.startsWith('rk_org_')
  if (isOrgKey && !stripeContext) {
    console.error(
      '[stripe] Organization API key detected but STRIPE_CONTEXT / STRIPE_ACCOUNT_ID is missing. Checkout will fail until it is set.'
    )
  }

  const options = {}
  if (stripeContext) {
    options.stripeContext = stripeContext
  }

  return new Stripe(secretKey, options)
}

export const stripe = createStripeClient()
