import express from 'express'
import * as phoneController from '../controllers/inboundPhone.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'
import { enforceLimits } from '../middlewares/enforceLimits.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// Permissions according to roadmap & matrix:
// GCC Admin: can provision, delete, list all
// Client Admin: can request port, list own, bind own numbers to agents

router.get('/', phoneController.getNumbers)
router.get('/:numberId/status', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), phoneController.checkStatus)

router.post('/', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), enforceLimits('max_inbound_phone_numbers'), phoneController.provisionNumber)

router.patch('/:numberId', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), phoneController.updateNumber)

router.post('/:numberId/bind', requireRole(['gcc_admin', 'client_admin']), phoneController.bindNumber)
router.patch('/:numberId/assign', requireRole(['gcc_admin', 'client_admin']), phoneController.bindNumber)

router.post('/:numberId/port-request', requireRole(['gcc_admin', 'client_admin']), phoneController.requestPort)
router.patch('/:numberId/port-review', requireRole(['gcc_admin', 'gcc_reviewer']), phoneController.reviewPort)

router.delete('/:numberId', requireRole(['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']), phoneController.deleteNumber)

export default router
