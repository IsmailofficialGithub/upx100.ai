import express from 'express'
import * as dashboardController from '../controllers/dashboard.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.use(auth)

router.get('/stats', dashboardController.getStats)

export default router
