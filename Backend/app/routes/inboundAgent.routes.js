import express from 'express'
import * as agentController from '../controllers/inboundAgent.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// Permissions according to roadmap:
// Create: gcc_admin only
// Read: all roles (scoped)
// Update: gcc_admin only (for core config)
// Delete: gcc_admin only

router.get('/', agentController.getAgents)
router.get('/:agentId', agentController.getAgent)

router.post('/', requireRole(['gcc_admin']), agentController.createAgent)
router.patch('/:agentId', requireRole(['gcc_admin']), agentController.updateAgent)
router.delete('/:agentId', requireRole(['gcc_admin']), agentController.deleteAgent)

export default router
