import express from 'express'
import * as agentController from '../controllers/inboundAgent.controller.js'
import * as knowledgeBaseController from '../controllers/knowledgeBase.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'
import { enforceLimits } from '../middlewares/enforceLimits.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// Permissions according to roadmap:
// Create: gcc_admin only
// Read: all roles (scoped)
// Update: gcc_admin only (for core config)
// Delete: gcc_admin only

router.get('/', agentController.getAgents)
router.post(
  '/knowledge-base/upload',
  requireRole(['gcc_admin', 'client_admin', 'sp_primary']),
  knowledgeBaseController.uploadAgentKnowledgeBase,
)
router.get('/:agentId', agentController.getAgent)

router.post('/', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), enforceLimits('max_agents'), agentController.createAgent)
router.patch('/:agentId', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), agentController.updateAgent)
router.delete('/:agentId', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), agentController.deleteAgent)

export default router
