import { StatusCodes } from 'http-status-codes'
import * as landingCallService from '../services/landingCall.service.js'

export const requestLandingCall = async (req, res) => {
  try {
    const body = req.body || {}
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'name is required' },
      })
    }

    if (!phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'phone is required' },
      })
    }

    if (body.consent !== true) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'consent is required' },
      })
    }

    const source = typeof body.source === 'string' ? body.source.trim() : 'landing_page'

    let webhookResult = null
    try {
      webhookResult = await landingCallService.triggerLandingPageCall({ name, phone, source })
    } catch (webhookError) {
      console.error('[requestLandingCall] webhook failed:', webhookError.message)
      return res.status(StatusCodes.BAD_GATEWAY).json({
        error: {
          code: 'WEBHOOK_FAILED',
          message: 'Unable to start your demo call right now. Please try again shortly.',
        },
      })
    }

    return res.status(StatusCodes.ACCEPTED).json({
      message: 'Demo call requested successfully',
      data: webhookResult,
    })
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: e.message || 'Failed to request demo call' },
    })
  }
}
