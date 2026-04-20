import * as uploadService from '../services/targetUpload.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Target Uploads
 */

export const submit = async (req, res) => {
  const uploadData = {
    ...req.body,
    organization_id: req.user.orgId,
    user_id: req.user.userId
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
  let uploads

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    uploads = await uploadService.listAllUploads()
  } else {
    uploads = await uploadService.listUploadsByOrg(orgId)
  }

  return res.json({ data: uploads })
}

export const review = async (req, res) => {
  const { uploadId } = req.params
  const { status } = req.body
  const { userId } = req.user

  if (!['approved', 'rejected', 'processing'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_STATUS', message: 'Invalid status update' }
    })
  }

  const result = await uploadService.updateUploadStatus(uploadId, status, userId)

  return res.json({
    message: `Upload status updated to ${status}`,
    data: result
  })
}
