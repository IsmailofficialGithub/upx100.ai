import express from 'express'
import * as analyticsController from '../controllers/analytics.controller.js'
import { auth } from '../middlewares/auth.js'

import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

router.use(auth)

router.get('/stats', requireRole(['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub']), analyticsController.getAnalytics)

export default router
