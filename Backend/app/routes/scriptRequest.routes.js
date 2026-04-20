import express from 'express'
import * as scriptController from '../controllers/scriptRequest.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/', scriptController.getRequests)
router.post('/', scriptController.submit)

// Reviewing is restricted to GCC staff
router.patch('/:requestId/review', requireRole(['gcc_admin', 'gcc_reviewer']), scriptController.review)

export default router
