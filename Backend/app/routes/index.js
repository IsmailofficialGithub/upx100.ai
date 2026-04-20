import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import agentRoutes from './inboundAgent.routes.js'

const router = express.Router()

// Mount sub-routers
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/agents', agentRoutes)

export default router
