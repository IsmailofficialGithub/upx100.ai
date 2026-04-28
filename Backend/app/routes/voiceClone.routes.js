import express from 'express'
import * as voiceController from '../controllers/voiceClone.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/', requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub']), voiceController.getClones)
router.post('/', requireRole(['gcc_admin', 'client_admin', 'client_sub']), voiceController.submit)

router.patch('/:cloneId/review', requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin']), voiceController.review)

export default router
