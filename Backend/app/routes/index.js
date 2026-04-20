import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import agentRoutes from './inboundAgent.routes.js'
import phoneRoutes from './inboundPhone.routes.js'

const router = express.Router()

// Mount sub-routers
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/agents', agentRoutes)
router.use('/phone-numbers', phoneRoutes)

export default router
