import express from 'express'
import * as voiceController from '../controllers/voiceClone.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/', voiceController.getClones)
router.post('/', voiceController.submit)

// Reviewing is restricted to GCC staff
router.patch('/:cloneId/review', requireRole(['gcc_admin', 'gcc_reviewer']), voiceController.review)

export default router
