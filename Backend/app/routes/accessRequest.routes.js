import express from 'express'
import {
  createAccessRequest,
  getAccessRequests,
  updateAccessRequestStatus
} from '../controllers/accessRequest.controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = express.Router()

// Public endpoint for submitting a request
router.post('/', createAccessRequest)

// Protected endpoints for admin review
router.get('/', requireAuth, getAccessRequests)
router.patch('/:id/status', requireAuth, updateAccessRequestStatus)

export default router
