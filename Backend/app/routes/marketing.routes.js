import express from 'express'
import * as landingCallController from '../controllers/landingCall.controller.js'

const router = express.Router()

router.post('/landing-call', landingCallController.requestLandingCall)

export default router
