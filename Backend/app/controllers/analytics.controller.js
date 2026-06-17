import * as analyticsService from '../services/analytics.service.js'
import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Controller for Analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const { role, orgId, userId } = req.user
    const q = req.query?.organization_id
    let scope = { orgId, orgIds: null }

    if ((role === 'gcc_admin' || role === 'gcc_reviewer') && q && UUID_RE.test(String(q))) {
      scope = { orgId: String(q), orgIds: null }
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      scope = { orgId: null, orgIds: assignments?.map((a) => a.client_org_id) || [] }
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      scope = { orgId: null, orgIds: [...new Set((deals || []).map((d) => d.client_org_id))] }
    }

    const analytics = await analyticsService.getClientAnalytics(scope)

    return res.status(StatusCodes.OK).json({ data: analytics })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message },
    })
  }
}
