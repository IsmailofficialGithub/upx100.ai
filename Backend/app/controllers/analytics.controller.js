import * as analyticsService from '../services/analytics.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Analytics
 */

export const getAnalytics = async (req, res) => {
  try {
    const { orgId } = req.user
    const analytics = await analyticsService.getClientAnalytics(orgId)
    
    return res.status(StatusCodes.OK).json({ data: analytics })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
