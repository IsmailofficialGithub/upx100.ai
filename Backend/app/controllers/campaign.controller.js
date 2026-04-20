import * as campaignService from '../services/campaign.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Campaign Control
 */

export const pauseAgent = async (req, res) => {
  const { agentId } = req.params
  const { reason } = req.body
  const { orgId, userId } = req.user

  if (!reason) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_REASON', message: 'A reason is required to pause a campaign' }
    })
  }

  const result = await campaignService.pauseCampaign(agentId, orgId, userId, reason)

  return res.json({
    message: 'Campaign paused successfully',
    data: result
  })
}

export const resumeAgent = async (req, res) => {
  const { agentId } = req.params
  const { reason } = req.body
  const { orgId, userId } = req.user

  const result = await campaignService.resumeCampaign(agentId, orgId, userId, reason)

  return res.json({
    message: 'Campaign resume initiated',
    data: result
  })
}

export const getHistory = async (req, res) => {
  const { agentId } = req.params
  const logs = await campaignService.getPauseHistory(agentId)

  return res.json({ data: logs })
}
