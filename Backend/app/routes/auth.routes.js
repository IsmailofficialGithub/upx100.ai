import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

// Public routes
router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/forgot-password', authController.forgotPassword)

// Protected routes (require valid JWT)
router.post('/logout', auth, authController.logout)
router.post('/reset-password', auth, authController.resetPassword)

export default router
