import express from 'express'
import * as leadController from '../controllers/lead.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

// Reading leads is scoped in controller
router.get('/', leadController.getLeads)
router.get('/:leadId', leadController.getLead)

router.post(
  '/',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']),
  leadController.createLead
)

router.patch(
  '/:leadId',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub']),
  leadController.updateLead
)
router.post('/:leadId/sync-crm', requireRole(['gcc_admin', 'gcc_reviewer']), leadController.syncCRM)

export default router
