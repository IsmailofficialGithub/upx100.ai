import * as voiceService from '../services/voiceClone.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Voice Clones
 */

export const submit = async (req, res) => {
  const orgId = req.body.organization_id || req.user.orgId
  const cloneData = {
    voice_name: req.body.voice_name?.trim() || null,
    duration_sec: req.body.duration_sec != null ? Number(req.body.duration_sec) : null,
    organization_id: orgId,
    user_id: req.user.userId,
    sample_url: req.body.sample_url?.trim() || null,
  }

  if (!cloneData.voice_name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_NAME', message: 'A voice persona name is required' },
    })
  }

  if (req.body.duration_sec != null && !voiceService.validateCloneDuration(req.body.duration_sec)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: 'INVALID_DURATION',
        message: 'Voice sample must be about 60 seconds (50–70 seconds accepted)',
      },
    })
  }

  if (req.body.sample_base64) {
    if (!req.body.duration_sec || !voiceService.validateCloneDuration(req.body.duration_sec)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: {
          code: 'INVALID_DURATION',
          message: 'Voice sample must be about 60 seconds (50–70 seconds accepted)',
        },
      })
    }
    try {
      cloneData.sample_url = await voiceService.persistSampleFromBase64({
        sample_base64: req.body.sample_base64,
        sample_mime: req.body.sample_mime || 'audio/mpeg',
        organization_id: orgId,
      })
    } catch (err) {
      const code = err.code === 'SAMPLE_TOO_LARGE' ? 'SAMPLE_TOO_LARGE' : 'STORAGE_UPLOAD_FAILED'
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code, message: err.message },
      })
    }
  }

  if (!cloneData.sample_url) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_SAMPLE', message: 'Upload a ~60 second voice sample (audio file)' },
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
  const { role, orgId, userId } = req.user

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Status must be approved or rejected' }
    })
  }

  // RBAC Check
  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (role !== 'client_admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Only GCC staff or Client Admin can review voice clones' }
      })
    }

    // Client Admin must own the clone
    const clone = await voiceService.getCloneById(cloneId)
    if (!clone || clone.organization_id !== orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You can only review voice clones within your organization' }
      })
    }
  }

  const result = await voiceService.updateCloneStatus(cloneId, status, userId)

  return res.json({
    message: `Voice clone ${status}`,
    data: result
  })
}
