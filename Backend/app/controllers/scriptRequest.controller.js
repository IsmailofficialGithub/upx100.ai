import * as scriptService from '../services/scriptRequest.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Script Requests
 */

export const submit = async (req, res) => {
  const organizationId = req.user.orgId || req.body.organization_id || null
  if (!organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: 'MISSING_ORGANIZATION',
        message:
          'organization_id is required. Your profile has no default org — pass organization_id in the JSON body (e.g. GCC admin), or assign an organization to your user.',
      },
    })
  }

  const requestData = {
    ...req.body,
    organization_id: organizationId,
    user_id: req.user.userId,
  }

  const result = await scriptService.submitRequest(requestData)

  return res.status(StatusCodes.CREATED).json({
    message: 'Script modification request submitted',
    data: result
  })
}

export const getRequests = async (req, res) => {
  const { role, orgId } = req.user
  let requests

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    requests = await scriptService.listAllRequests()
  } else if (!orgId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: 'MISSING_ORGANIZATION',
        message:
          'Your profile has no organization. Assign an organization to your user, or use a GCC account to list all requests.',
      },
    })
  } else {
    requests = await scriptService.listRequestsByOrg(orgId)
  }

  return res.json({ data: requests })
}

export const review = async (req, res) => {
  const { requestId } = req.params
  const { status, notes } = req.body
  const { userId } = req.user

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Status must be approved or rejected' }
    })
  }

  const result = await scriptService.updateRequestStatus(requestId, status, notes, userId)

  return res.json({
    message: `Request ${status}`,
    data: result
  })
}
