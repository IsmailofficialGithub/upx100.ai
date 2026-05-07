import * as phoneService from '../services/inboundPhone.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Inbound Phone Numbers
 */

export const getNumbers = async (req, res) => {
  const { role, orgId, userId } = req.user
  let numbers

  console.log(`[PhoneCtrl] getNumbers for role: ${role}, orgId: ${orgId}, userId: ${userId}`)
  if (role === 'gcc_admin') {
    numbers = await phoneService.listAllNumbers()
  } else {
    // Org Admin sees everything in org, Sub-user only sees own
    const filterUserId = ['client_admin', 'sp_primary'].includes(role) ? null : userId
    console.log(`[PhoneCtrl] filterUserId: ${filterUserId}`)
    numbers = await phoneService.listNumbersByOrg(orgId, filterUserId)
  }

  return res.json({ data: numbers })
}

export const provisionNumber = async (req, res) => {
  const numberData = {
    ...req.body,
    organization_id: req.user.role === 'gcc_admin' 
      ? req.body.organization_id 
      : (req.user.orgId && req.user.orgId !== '00000000-0000-4000-a000-000000000003' ? req.user.orgId : null),
    user_id: req.user.userId
  }

  const result = await phoneService.provisionNumber(numberData)

  return res.status(StatusCodes.CREATED).json({
    message: 'Number provisioning initiated',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const updateNumber = async (req, res) => {
  const { numberId } = req.params
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await phoneService.getNumberById(numberId)
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this number' }
      })
    }
    
    // Sub-users can only manage their own numbers
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this number' }
      })
    }
    // Organization cannot be changed by non-GCC
    delete req.body.organization_id
  }

  const result = await phoneService.updateNumber(numberId, {
    ...req.body,
    user_id: req.user.userId
  })

  return res.json({
    message: 'Number updated successfully',
    data: result
  })
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
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await phoneService.getNumberById(numberId)
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this number' }
      })
    }
    // Sub-users can only bind their own numbers
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this number' }
      })
    }
  }

  const result = await phoneService.bindNumberToAgent(numberId, agentId)

  return res.json({
    message: 'Number successfully bound to agent',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const requestPort = async (req, res) => {
  const { numberId } = req.params
  const portData = req.body

  const result = await phoneService.requestPort(numberId, portData)

  return res.json({
    message: 'Port request submitted successfully',
    data: result
  })
}

export const deleteNumber = async (req, res) => {
  const { numberId } = req.params
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await phoneService.getNumberById(numberId)
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this number' }
      })
    }
    // Sub-users can only delete their own numbers
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this number' }
      })
    }
  }

  const result = await phoneService.deleteNumber(numberId)

  return res.json({
    message: 'Number deleted successfully',
    webhookResult: result.webhook
  })
}
