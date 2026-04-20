import express from 'express'
import * as callLogController from '../controllers/callLog.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

// Webhook endpoint (Public, but protected by secret check in controller)
router.post('/webhook', callLogController.handleVapiWebhook)

// Protected user routes
router.use(auth)
router.get('/', callLogController.getLogs)
router.get('/:logId', callLogController.getLog)

export default router
