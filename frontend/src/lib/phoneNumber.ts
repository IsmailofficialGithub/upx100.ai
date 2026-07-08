const E164_PATTERN = /^\+[1-9]\d{6,14}$/

/** Strip formatting; keep a leading + when present. */
export function normalizeE164Phone(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')
  return hasPlus ? `+${digits}` : digits
}

export function getPhoneValidationError(value: string): string | null {
  const normalized = normalizeE164Phone(value)
  if (!normalized) return 'Phone number is required'
  if (!normalized.startsWith('+')) {
    return 'Include country code starting with + (e.g. +15550123456)'
  }
  if (!/^\+[1-9]\d*$/.test(normalized)) return 'Invalid country code'
  if (normalized.length < 8) return 'Phone number is too short'
  if (normalized.length > 16) return 'Phone number is too long'
  if (!E164_PATTERN.test(normalized)) return 'Enter a valid phone number in E.164 format'
  return null
}

export function isValidE164Phone(value: string): boolean {
  return getPhoneValidationError(value) === null
}
