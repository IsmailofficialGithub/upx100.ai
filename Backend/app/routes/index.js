import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import agentRoutes from './inboundAgent.routes.js'
import phoneRoutes from './inboundPhone.routes.js'
import callLogRoutes from './callLog.routes.js'
import leadRoutes from './lead.routes.js'
import campaignRoutes from './campaign.routes.js'

const router = express.Router()

// Mount sub-routers
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/agents', agentRoutes)
router.use('/phone-numbers', phoneRoutes)
router.use('/call-logs', callLogRoutes)
router.use('/leads', leadRoutes)
router.use('/campaigns', campaignRoutes)

export default router
