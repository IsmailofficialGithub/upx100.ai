import express from 'express'
import * as scriptController from '../controllers/scriptRequest.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/', requireRole(['gcc_admin', 'gcc_reviewer', 'sp_primary', 'client_admin']), scriptController.getRequests)
router.post('/', requireRole(['gcc_admin', 'sp_primary', 'client_admin']), scriptController.submit)

// Reviewing is restricted to GCC staff
router.patch('/:requestId/review', requireRole(['gcc_admin', 'gcc_reviewer']), scriptController.review)

export default router
