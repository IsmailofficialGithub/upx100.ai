import * as analyticsService from '../services/analytics.service.js'
import { StatusCodes } from 'http-status-codes'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Controller for Analytics
 */

export const getAnalytics = async (req, res) => {
  try {
    const { role, orgId } = req.user
    const q = req.query?.organization_id
    let effectiveOrgId = orgId
    if ((role === 'gcc_admin' || role === 'gcc_reviewer') && q && UUID_RE.test(String(q))) {
      effectiveOrgId = q
    }

    const analytics = await analyticsService.getClientAnalytics(effectiveOrgId)

    return res.status(StatusCodes.OK).json({ data: analytics })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
