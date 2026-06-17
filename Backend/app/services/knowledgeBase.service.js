import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../config/supabase.js'

const BUCKET = process.env.KNOWLEDGE_BASE_BUCKET || 'knowledge_base'
const MAX_BYTES = 15 * 1024 * 1024

const ALLOWED_EXT = new Set(['csv', 'txt', 'pdf', 'json', 'md', 'markdown', 'docx', 'xlsx', 'xls'])

const MIME_BY_EXT = {
  csv: 'text/csv',
  txt: 'text/plain',
  pdf: 'application/pdf',
  json: 'application/json',
  md: 'text/markdown',
  markdown: 'text/markdown',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
}

function sanitizeFileName(name = 'upload') {
  const base = String(name).split(/[/\\]/).pop() || 'upload'
  const cleaned = base.replace(/[^\w.\-]+/g, '_').slice(0, 120)
  return cleaned || 'upload'
}

function extFromName(name) {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : ''
}

export function validateKnowledgeFile({ file_name, file_mime, byteLength }) {
  const ext = extFromName(file_name)
  if (!ext || !ALLOWED_EXT.has(ext)) {
    const err = new Error(
      'Unsupported file type. Use CSV, TXT, PDF, JSON, Markdown, Word, or Excel.',
    )
    err.code = 'INVALID_FILE_TYPE'
    throw err
  }
  if (byteLength > MAX_BYTES) {
    const err = new Error('File is too large (max 15MB).')
    err.code = 'FILE_TOO_LARGE'
    throw err
  }
  const mime = file_mime || MIME_BY_EXT[ext] || 'application/octet-stream'
  return { ext, mime }
}

/**
 * Upload company knowledge file to Supabase Storage; returns public URL.
 */
export const persistKnowledgeFileFromBase64 = async ({
  file_base64,
  file_name,
  file_mime,
  organization_id,
  agent_id,
}) => {
  if (!organization_id) {
    const err = new Error('organization_id is required to upload knowledge files.')
    err.code = 'MISSING_ORG'
    throw err
  }

  const buffer = Buffer.from(file_base64, 'base64')
  const { ext, mime } = validateKnowledgeFile({
    file_name,
    file_mime,
    byteLength: buffer.length,
  })

  const safeName = sanitizeFileName(file_name)
  const folder = agent_id || 'draft'
  const path = `${organization_id}/${folder}/${randomUUID()}.${ext || safeName.split('.').pop()}`

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: mime,
    upsert: false,
  })

  if (error) {
    const err = new Error(
      error.message || `Could not store file. Configure Supabase bucket "${BUCKET}".`,
    )
    err.code = 'STORAGE_UPLOAD_FAILED'
    throw err
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return {
    url: data.publicUrl,
    path,
    file_name: safeName,
    content_type: mime,
    size_bytes: buffer.length,
  }
}
