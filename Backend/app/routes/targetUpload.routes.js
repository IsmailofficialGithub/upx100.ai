import express from 'express'
import * as uploadController from '../controllers/targetUpload.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/', requireRole(['gcc_admin', 'gcc_reviewer', 'client_admin']), uploadController.getUploads)
router.post('/', requireRole(['gcc_admin', 'client_admin']), uploadController.submit)

// Status updates restricted to GCC staff
router.patch('/:uploadId/status', requireRole(['gcc_admin', 'gcc_reviewer']), uploadController.review)

export default router
