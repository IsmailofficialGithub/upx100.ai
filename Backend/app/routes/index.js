import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import agentRoutes from './inboundAgent.routes.js'
import phoneRoutes from './inboundPhone.routes.js'
import callLogRoutes from './callLog.routes.js'
import leadRoutes from './lead.routes.js'
import campaignRoutes from './campaign.routes.js'
import scriptRequestRoutes from './scriptRequest.routes.js'
import voiceCloneRoutes from './voiceClone.routes.js'
import targetUploadRoutes from './targetUpload.routes.js'
import adminRoutes from './admin.routes.js'
import exportRoutes from './export.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import analyticsRoutes from './analytics.routes.js'
import commissionRoutes from './commission.routes.js'
import outboundTargetRoutes from './outboundTarget.routes.js'
import billingRoutes from './billing.routes.js'

const router = express.Router()

// Mount sub-routers
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/export', exportRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/commissions', commissionRoutes)
router.use('/users', userRoutes)
router.use('/billing', billingRoutes)

router.use('/agents', agentRoutes)
router.use('/phone-numbers', phoneRoutes)
router.use('/call-logs', callLogRoutes)
router.use('/leads', leadRoutes)
router.use('/campaigns', campaignRoutes)
router.use('/script-requests', scriptRequestRoutes)
router.use('/voice-clones', voiceCloneRoutes)
router.use('/target-uploads', targetUploadRoutes)
router.use('/outbound-targets', outboundTargetRoutes)

export default router
