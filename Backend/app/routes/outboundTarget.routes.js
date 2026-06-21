import express from 'express'
import * as outboundTargetController from '../controllers/outboundTarget.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

// Reading outbound targets is scoped within the controller logic
router.get('/', outboundTargetController.getOutboundTargets)
router.get('/:id', outboundTargetController.getOutboundTarget)

// Single creation
router.post(
  '/',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']),
  outboundTargetController.createOutboundTarget
)

// Bulk/File import creation
router.post(
  '/bulk',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']),
  outboundTargetController.createOutboundTargetsBulk
)

// Updates
router.patch(
  '/:id',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']),
  outboundTargetController.updateOutboundTarget
)

// Deletion
router.delete(
  '/:id',
  requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']),
  outboundTargetController.deleteOutboundTarget
)

export default router
