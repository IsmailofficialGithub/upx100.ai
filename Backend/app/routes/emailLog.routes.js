import express from 'express'
import { getEmailLogs, createEmailLogFromWebhook } from '../controllers/emailLog.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', auth, getEmailLogs)

// Webhook for n8n (no auth required)
router.post('/webhook', createEmailLogFromWebhook)

export default router
