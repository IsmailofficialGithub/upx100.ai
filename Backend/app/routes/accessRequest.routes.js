import express from 'express'
import {
  createAccessRequest,
  getAccessRequests,
  updateAccessRequestStatus
} from '../controllers/accessRequest.controller.js'
import { auth, isAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Public endpoint for submitting a request
router.post('/', createAccessRequest)

// Protected endpoints for admin review
router.get('/', auth, isAdmin, getAccessRequests)
router.patch('/:id/status', auth, isAdmin, updateAccessRequestStatus)

export default router
