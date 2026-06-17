import * as uploadService from '../services/targetUpload.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Target Uploads
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

  const uploadData = {
    ...req.body,
    organization_id: organizationId,
    user_id: req.user.userId,
  }

  // Basic validation for file reference
  if (!uploadData.file_url) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_FILE', message: 'A file URL or reference is required' }
    })
  }

  const result = await uploadService.submitUpload(uploadData)

  return res.status(StatusCodes.CREATED).json({
    message: 'Campaign target list submitted',
    data: result
  })
}

export const getUploads = async (req, res) => {
  const { role, orgId } = req.user
  const requestedOrgId = req.query.organization_id || null
  let uploads

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (requestedOrgId) {
      uploads = await uploadService.listUploadsByOrg(requestedOrgId)
    } else {
      uploads = await uploadService.listAllUploads()
    }
  } else if (!orgId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: 'MISSING_ORGANIZATION',
        message:
          'Your profile has no organization. Assign an organization to your user, or use a GCC account to list all uploads.',
      },
    })
  } else {
    if (requestedOrgId && requestedOrgId !== orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Cannot list uploads for another organization' },
      })
    }
    uploads = await uploadService.listUploadsByOrg(orgId)
  }

  return res.json({ data: uploads })
}

export const review = async (req, res) => {
  const { uploadId } = req.params
  const { status, rejection_note: rejectionNote } = req.body
  const { userId, role } = req.user

  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Only GCC staff can review uploads' },
    })
  }

  if (!['approved', 'rejected', 'processing'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Invalid status update' }
    })
  }

  const result = await uploadService.updateUploadStatus(
    uploadId,
    status,
    userId,
    rejectionNote,
  )

  return res.json({
    message: `Upload status updated to ${status}`,
    data: result
  })
}
