import express from 'express'
import * as callLogController from '../controllers/callLog.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

// Webhook endpoint (Public, but protected by secret check in controller)
router.post('/webhook', callLogController.handleVapiWebhook)

router.get('/public-test/:vapiCallId', async (req, res) => {
  try {
    const vapiRes = await fetch(`https://api.vapi.ai/call/${req.params.vapiCallId}`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` }
    })
    if (vapiRes.ok) {
      const d = await vapiRes.json()
      const presignedUrl = d.artifact?.presignedMonoUrl || d.artifact?.presignedStereoUrl || d.recordingUrl;
      return res.json({ url: presignedUrl, vapiData: d })
    }
    return res.status(vapiRes.status).json({ error: 'vapi error', text: await vapiRes.text() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Protected user routes
router.use(auth)
router.get('/', callLogController.getLogs)
router.get('/:logId', callLogController.getLog)
router.get('/:logId/recording', callLogController.streamRecording)

export default router
