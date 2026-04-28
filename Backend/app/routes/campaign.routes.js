import express from 'express'
import * as campaignController from '../controllers/campaign.controller.js'
import { auth } from '../middlewares/auth.js'

import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

// Note: Logic for ensuring they own the agent is handled in the service/middleware layer if needed
// For now, these are the basic campaign control endpoints
router.post('/:agentId/pause', requireRole(['gcc_admin', 'client_admin']), campaignController.pauseAgent)
router.post('/:agentId/resume', requireRole(['gcc_admin', 'client_admin']), campaignController.resumeAgent)
router.get('/:agentId/history', requireRole(['gcc_admin', 'gcc_reviewer', 'sp_primary', 'client_admin']), campaignController.getHistory)

export default router
