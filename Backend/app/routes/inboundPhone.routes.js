import express from 'express'
import * as phoneController from '../controllers/inboundPhone.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// Permissions according to roadmap & matrix:
// GCC Admin: can provision, delete, list all
// Client Admin: can request port, list own, bind own numbers to agents

router.get('/', phoneController.getNumbers)

router.post('/', requireRole(['gcc_admin']), phoneController.provisionNumber)

router.post('/:numberId/bind', requireRole(['gcc_admin', 'client_admin']), phoneController.bindNumber)

router.post('/:numberId/port-request', requireRole(['client_admin']), phoneController.requestPort)

router.delete('/:numberId', requireRole(['gcc_admin']), phoneController.deleteNumber)

export default router
