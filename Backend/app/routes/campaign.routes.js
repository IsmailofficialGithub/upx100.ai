import express from 'express'
import * as campaignController from '../controllers/campaign.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.use(auth)

// Note: Logic for ensuring they own the agent is handled in the service/middleware layer if needed
// For now, these are the basic campaign control endpoints
router.post('/:agentId/pause', campaignController.pauseAgent)
router.post('/:agentId/resume', campaignController.resumeAgent)
router.get('/:agentId/history', campaignController.getHistory)

export default router
