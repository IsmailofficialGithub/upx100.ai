import { StatusCodes } from 'http-status-codes'
import { resolveChannelAccess } from '../utils/channelAccess.js'

/** Block outbound targets/campaigns when user lacks outbound access. */
export const requireOutboundAccess = (req, res, next) => {
  const { canOutbound } = resolveChannelAccess(req.user)
  if (!canOutbound) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: {
        code: 'CHANNEL_FORBIDDEN',
        message: 'Your account does not have outbound access',
      },
    })
  }
  return next()
}

/** Block inbound-only resources when user lacks inbound access. */
export const requireInboundAccess = (req, res, next) => {
  const { canInbound } = resolveChannelAccess(req.user)
  if (!canInbound) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: {
        code: 'CHANNEL_FORBIDDEN',
        message: 'Your account does not have inbound access',
      },
    })
  }
  return next()
}
