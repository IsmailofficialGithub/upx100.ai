import * as voiceService from '../services/voiceClone.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Voice Clones
 */

export const submit = async (req, res) => {
  const cloneData = {
    ...req.body,
    organization_id: req.user.orgId,
    user_id: req.user.userId
  }

  // Basic validation for required audio sample
  if (!cloneData.sample_url) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_SAMPLE', message: 'A voice sample URL or reference is required' }
    })
  }

  const result = await voiceService.submitCloneRequest(cloneData)

  return res.status(StatusCodes.CREATED).json({
    message: 'Voice clone request submitted for review',
    data: result
  })
}

export const getClones = async (req, res) => {
  const { role, orgId } = req.user
  let clones

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    clones = await voiceService.listAllClones()
  } else {
    clones = await voiceService.listClonesByOrg(orgId)
  }

  return res.json({ data: clones })
}

export const review = async (req, res) => {
  const { cloneId } = req.params
  const { status } = req.body
  const { userId } = req.user

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Status must be approved or rejected' }
    })
  }

  const result = await voiceService.updateCloneStatus(cloneId, status, userId)

  return res.json({
    message: `Voice clone ${status}`,
    data: result
  })
}
