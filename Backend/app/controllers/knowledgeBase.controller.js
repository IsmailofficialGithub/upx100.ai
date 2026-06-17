import * as knowledgeBaseService from '../services/knowledgeBase.service.js'
import { StatusCodes } from 'http-status-codes'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const uploadAgentKnowledgeBase = async (req, res) => {
  const orgId = req.body.organization_id || req.user.orgId
  if (!orgId || !UUID_RE.test(String(orgId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_ORG', message: 'A valid organization_id is required.' },
    })
  }

  if (!req.body.file_base64) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_FILE', message: 'Upload a knowledge file (CSV, PDF, TXT, etc.).' },
    })
  }

  const agentId = req.body.agent_id?.trim() || null
  if (agentId && !UUID_RE.test(agentId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_AGENT', message: 'Invalid agent_id.' },
    })
  }

  try {
    const result = await knowledgeBaseService.persistKnowledgeFileFromBase64({
      file_base64: req.body.file_base64,
      file_name: req.body.file_name || 'knowledge.csv',
      file_mime: req.body.file_mime,
      organization_id: orgId,
      agent_id: agentId,
    })

    return res.status(StatusCodes.CREATED).json({
      message: 'Knowledge file uploaded',
      data: result,
    })
  } catch (err) {
    const status =
      err.code === 'FILE_TOO_LARGE' || err.code === 'INVALID_FILE_TYPE'
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.BAD_REQUEST
    return res.status(status).json({
      error: { code: err.code || 'UPLOAD_FAILED', message: err.message },
    })
  }
}
