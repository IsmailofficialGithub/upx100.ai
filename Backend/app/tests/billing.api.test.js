import request from 'supertest'
import app from '../app.js'
import * as stripeService from '../services/stripe.service.js'
import { paymentQueue } from '../queues/payment.queue.js'
import { supabaseAdmin } from '../config/supabase.js'
import Stripe from 'stripe'

// Mock Redis & BullMQ
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn()
  }))
})

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({ add: jest.fn() })),
  Worker: jest.fn().mockImplementation(() => ({ on: jest.fn() }))
}))

// Mock authentication middlewares to prevent admin router crash
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', email: 'client@example.com', userId: 'user123' }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

// Mock Stripe Service
jest.mock('../services/stripe.service.js', () => ({
  createCheckoutSession: jest.fn(),
  confirmCheckoutSession: jest.fn(),
  createPortalSession: jest.fn()
}))

// Setup a mock query chain object for Supabase directly in the factory block
jest.mock('../config/supabase.js', () => {
  const query = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
    maybeSingle: jest.fn()
  }
  query.from.mockReturnValue(query)
  query.select.mockReturnValue(query)
  query.insert.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  query.order.mockReturnValue(query)

  return {
    supabaseAdmin: query
  }
})

// Mock Stripe SDK and attach constructEventMock to global scope to prevent hoisting ReferenceError
jest.mock('stripe', () => {
  const constructEvent = jest.fn()
  global.stripeConstructEventMock = constructEvent
  return jest.fn().mockImplementation(() => {
    return {
      webhooks: {
        constructEvent
      }
    }
  })
})

describe('Billing and Payment API', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset standard self-returning chains
    supabaseAdmin.from.mockReturnValue(supabaseAdmin)
    supabaseAdmin.select.mockReturnValue(supabaseAdmin)
    supabaseAdmin.insert.mockReturnValue(supabaseAdmin)
    supabaseAdmin.eq.mockReturnValue(supabaseAdmin)
    supabaseAdmin.order.mockReturnValue(supabaseAdmin)
  })

  describe('POST /api/billing/checkout', () => {
    it('should fail if packageId is missing', async () => {
      const res = await request(app)
        .post('/api/billing/checkout')
        .send({})
      
      expect(res.statusCode).toEqual(400)
      expect(res.body.error.code).toBe('MISSING_PACKAGE_ID')
    })

    it('should succeed and return redirect url', async () => {
      stripeService.createCheckoutSession.mockResolvedValue('https://checkout.stripe.com/pay/session_123')
      
      const res = await request(app)
        .post('/api/billing/checkout')
        .send({ packageId: 'package-pro-123' })
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.url).toBe('https://checkout.stripe.com/pay/session_123')
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith({
        organizationId: 'org123',
        packageId: 'package-pro-123',
        customerEmail: 'client@example.com'
      })
    })
  })

  describe('POST /api/billing/checkout/confirm', () => {
    it('should confirm the session for the authenticated organization', async () => {
      stripeService.confirmCheckoutSession.mockResolvedValue({ status: 'active' })

      const res = await request(app)
        .post('/api/billing/checkout/confirm')
        .send({ sessionId: 'cs_test_123' })

      expect(res.statusCode).toEqual(200)
      expect(res.body.data.status).toBe('active')
      expect(stripeService.confirmCheckoutSession).toHaveBeenCalledWith({
        organizationId: 'org123',
        sessionId: 'cs_test_123'
      })
    })
  })

  describe('POST /api/billing/portal', () => {
    it('should return redirect URL for customer billing portal', async () => {
      stripeService.createPortalSession.mockResolvedValue('https://billing.stripe.com/p/session/portal_123')
      
      const res = await request(app)
        .post('/api/billing/portal')
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.url).toBe('https://billing.stripe.com/p/session/portal_123')
      expect(stripeService.createPortalSession).toHaveBeenCalledWith('org123')
    })
  })

  describe('GET /api/billing/status', () => {
    it('should retrieve active subscription status and card cache details', async () => {
      supabaseAdmin.maybeSingle
        .mockResolvedValueOnce({ data: { id: 'sub_123', status: 'active' }, error: null }) // First call is subscription query
        .mockResolvedValueOnce({ data: { card_brand: 'visa', card_last4: '4242' }, error: null }) // Second call is payment card query

      const res = await request(app)
        .get('/api/billing/status')
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.data.subscription).toHaveProperty('status', 'active')
      expect(res.body.data.payment_method).toHaveProperty('card_last4', '4242')
    })
  })

  describe('GET /api/billing/invoices', () => {
    it('should return invoices list', async () => {
      supabaseAdmin.order.mockResolvedValueOnce({
        data: [
          { stripe_invoice_id: 'in_123', amount_cents: 4900, status: 'paid' }
        ],
        error: null
      })

      const res = await request(app)
        .get('/api/billing/invoices')
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0]).toHaveProperty('stripe_invoice_id', 'in_123')
    })
  })

  describe('GET /api/billing/packages', () => {
    it('should return packages list', async () => {
      supabaseAdmin.order.mockResolvedValueOnce({
        data: [
          { id: 'pkg_1', name: 'Free', amount_cents: 0 }
        ],
        error: null
      })

      const res = await request(app)
        .get('/api/billing/packages')
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.data[0]).toHaveProperty('name', 'Free')
    })
  })

  describe('POST /api/billing/webhook (Public raw body endpoint)', () => {
    it('should reject requests with missing Stripe signature', async () => {
      const res = await request(app)
        .post('/api/billing/webhook')
        .send({ id: 'evt_123', type: 'customer.subscription.deleted' })
      
      expect(res.statusCode).toEqual(400)
      expect(res.text).toContain('Webhook Error: Missing configuration')
    })

    it('should verify signature, save pending webhook log, enqueue background task, and return 200', async () => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_secret'
      const mockEvent = { id: 'evt_123', type: 'customer.subscription.updated' }
      
      global.stripeConstructEventMock.mockReturnValue(mockEvent)
      supabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: null, error: null }) // No duplicate logged
      supabaseAdmin.insert.mockResolvedValueOnce({ error: null }) // Event insert succeeds

      const res = await request(app)
        .post('/api/billing/webhook')
        .set('stripe-signature', 't=123,v1=sig_123')
        .send(JSON.stringify(mockEvent))

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ received: true })
      expect(paymentQueue.add).toHaveBeenCalledWith('process-stripe-webhook', { event: mockEvent }, { jobId: mockEvent.id })
    })

    it('should handle duplicate events gracefully by returning 200 early', async () => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_secret'
      const mockEvent = { id: 'evt_123', type: 'customer.subscription.updated' }
      
      global.stripeConstructEventMock.mockReturnValue(mockEvent)
      supabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: { id: 'log_abc', status: 'processed' }, error: null }) // Duplicate exists

      const res = await request(app)
        .post('/api/billing/webhook')
        .set('stripe-signature', 't=123,v1=sig_123')
        .send(JSON.stringify(mockEvent))

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ received: true, duplicate: true })
      expect(paymentQueue.add).not.toHaveBeenCalled()
    })
  })
})
