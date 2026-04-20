import * as phoneService from '../services/inboundPhone.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Inbound Phone Numbers
 */

export const getNumbers = async (req, res) => {
  const { role, orgId } = req.user
  let numbers

  if (role === 'gcc_admin') {
    numbers = await phoneService.listAllNumbers()
  } else {
    numbers = await phoneService.listNumbersByOrg(orgId)
  }

  return res.json({ data: numbers })
}

export const provisionNumber = async (req, res) => {
  const numberData = {
    ...req.body,
    organization_id: req.user.role === 'gcc_admin' ? req.body.organization_id : req.user.orgId
  }

  const result = await phoneService.provisionNumber(numberData)

  return res.status(StatusCodes.CREATED).json({
    message: 'Number provisioning initiated',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const bindNumber = async (req, res) => {
  const { numberId } = req.params
  const { agentId } = req.body

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

  const result = await phoneService.deleteNumber(numberId)

  return res.json({
    message: 'Number deleted successfully',
    webhookResult: result.webhook
  })
}
