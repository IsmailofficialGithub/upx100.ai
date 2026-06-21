import express from 'express'
import * as billingController from '../controllers/billing.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

// Note: The webhook route (POST /api/billing/webhook) is registered directly in app.js 
// to ensure it consumes raw request body buffers for Stripe signature verification.

// All billing endpoints here require authentication
router.use(auth)

// Only clients or admins can manage checkout/portal subscriptions
router.post('/checkout', requireRole(['gcc_admin', 'client_admin']), billingController.checkout)
router.post('/portal', requireRole(['gcc_admin', 'client_admin']), billingController.portal)

// Retrieve active billing packages
router.get('/packages', requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub']), billingController.getPackages)

// Sub-users, admins, and reviewers can view the subscription status
router.get('/status', requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub']), billingController.status)

// Invoices/billing history is typically admin-restricted
router.get('/invoices', requireRole(['gcc_admin', 'client_admin']), billingController.invoices)

export default router
