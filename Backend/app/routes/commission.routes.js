import express from 'express'
import * as commissionController from '../controllers/commission.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.get('/', auth, requireRole(['gcc_admin', 'sp_primary', 'sp_sub']), commissionController.getCommissions)

export default router
