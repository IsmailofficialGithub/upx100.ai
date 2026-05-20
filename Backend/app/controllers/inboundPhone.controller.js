import * as phoneService from '../services/inboundPhone.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Inbound Phone Numbers
 */

export const getNumbers = async (req, res) => {
  const { role, orgId, userId } = req.user
  const rawOrg = req.query?.organization_id
  const forAgentId = req.query?.for_agent_id || null
  const assignableOnly =
    req.query?.assignable === '1' || req.query?.assignable === 'true'

  const orgFilter =
    rawOrg && rawOrg !== 'all' && rawOrg !== 'null' ? String(rawOrg) : null

  let numbers

  if (role === 'gcc_admin' || role === 'gcc_reviewer') {
    numbers = await phoneService.listAllNumbers({
      organizationId: orgFilter,
      forAgentId,
      assignableOnly,
    })
  } else {
    const filterUserId = ['client_admin', 'sp_primary'].includes(role) ? null : userId
    const effectiveOrg =
      orgFilter ||
      (orgId && orgId !== '00000000-0000-4000-a000-000000000003' ? orgId : null)
    numbers = await phoneService.listNumbersByOrg(effectiveOrg, filterUserId, {
      forAgentId,
      assignableOnly,
    })
  }

  return res.json({ data: numbers })
}

export const provisionNumber = async (req, res) => {
  const { role, orgId, userId } = req.user
  const isGcc = role === 'gcc_admin'
  const isClientAdmin = role === 'client_admin'

  if (!isGcc && !isClientAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin or Client Admin can register phone numbers.' },
    })
  }

  const organization_id = isGcc
    ? req.body.organization_id
    : orgId && orgId !== '00000000-0000-4000-a000-000000000003'
      ? orgId
      : req.body.organization_id

  const numberData = {
    ...req.body,
    organization_id,
    user_id: req.body.user_id || userId,
  }

  try {
    const result = await phoneService.provisionNumber(numberData)
    return res.status(StatusCodes.CREATED).json({
      message: 'Number provisioning initiated',
      data: result.db,
      webhookResult: result.webhook,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to provision number' },
    })
  }
}

export const updateNumber = async (req, res) => {
  const { numberId } = req.params
  const { role } = req.user

  if (role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can update number configurations.' }
    })
  }

  try {
    const result = await phoneService.updateNumber(numberId, {
      ...req.body,
      user_id: req.user.userId,
    })
    return res.json({
      message: 'Number updated successfully',
      data: result,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to update number' },
    })
  }
}

export const checkStatus = async (req, res) => {
  const { numberId } = req.params
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await phoneService.getNumberById(numberId)
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to view this number' }
      })
    }
    // Sub-users can only view their own status
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to view this number' }
      })
    }
  }

  const result = await phoneService.checkNumberStatus(numberId)

  return res.json({
    message: 'Status check completed',
    status: result.status
  })
}

export const bindNumber = async (req, res) => {
  const { numberId } = req.params
  const { agentId } = req.body
  const { role } = req.user

  if (role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can bind numbers to agents.' }
    })
  }

  try {
    const result = await phoneService.bindNumberToAgent(numberId, agentId)
    return res.json({
      message: 'Number successfully bound to agent',
      data: result.db,
      webhookResult: result.webhook,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to bind number' },
    })
  }
}

export const requestPort = async (req, res) => {
  const { numberId } = req.params
  const { role, orgId, userId } = req.user
  const portData = req.body

  if (role !== 'gcc_admin' && role !== 'client_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only Client Admin or GCC Admin can initiate port requests.' }
    })
  }

  const existing = await phoneService.getNumberById(numberId)
  if (!existing) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Number not found' }
    })
  }

  if (role !== 'gcc_admin') {
    const effectiveOrgId = orgId && orgId !== '00000000-0000-4000-a000-000000000003' ? orgId : null
    if (!effectiveOrgId || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to port this number' }
      })
    }
  }

  try {
    const data = await phoneService.submitPortRequest(numberId, portData, userId)
    return res.json({
      message: 'Port request submitted successfully',
      data
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Port request failed' }
    })
  }
}

export const reviewPort = async (req, res) => {
  const { numberId } = req.params
  const { status } = req.body
  const { role, userId } = req.user

  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC staff can review port requests' },
    })
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Status must be approved or rejected' },
    })
  }

  try {
    const data = await phoneService.reviewPortRequest(numberId, status, userId)
    return res.json({
      message: `Port request ${status}`,
      data,
    })
  } catch (e) {
    const code = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(code).json({
      error: { message: e.message || 'Port review failed' },
    })
  }
}

export const deleteNumber = async (req, res) => {
  const { numberId } = req.params
  const { role } = req.user

  if (role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can delete numbers.' }
    })
  }

  const result = await phoneService.deleteNumber(numberId)

  return res.json({
    message: 'Number deleted successfully',
    webhookResult: result.webhook
  })
}
