import * as authService from '../services/auth.service.js'
import { StatusCodes } from 'http-status-codes'

/** Coerce absent or junk values to null so UUID columns never see the string "null". */
const normalizeOptionalUuid = (value) => {
  if (value == null || value === '' || value === 'null' || value === 'undefined') return null
  return value
}

function isSupabaseReachabilityError(err) {
  if (!err) return false
  const msg = String(err.message || err).toLowerCase()
  const cause = err.cause
  const causeCode = cause?.code || cause?.errno
  return (
    msg.includes('fetch failed') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound') ||
    msg.includes('enetunreach') ||
    causeCode === 'ENOENT' ||
    causeCode === 'ENOTFOUND' ||
    causeCode === 'ECONNREFUSED'
  )
}

/**
 * Middleware to authenticate requests using Supabase JWT
 * Attaches user profile and context to the request object
 */
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' }
      })
    }

    const token = authHeader.split(' ')[1]

    // 1. Verify JWT with Supabase service
    const { data: { user }, error: authError } = await authService.getUserFromToken(token)

    if (authError || !user) {
      if (isSupabaseReachabilityError(authError)) {
        console.error('[auth] Supabase Auth unreachable:', authError?.message || authError)
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: {
            code: 'SUPABASE_UNAVAILABLE',
            message:
              'Cannot reach Supabase Auth right now (network/DNS). Check your connection and SUPABASE_URL, then retry.',
          },
        })
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' },
      })
    }

    // 2. Lookup the user's profile for role and org info
    const { data: profile, error: profileError } = await authService.getUserProfile(user.id)

    if (profileError || !profile) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' },
      })
    }

    // 3. Check if user is active
    if (!profile.is_active) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'ACCOUNT_INACTIVE', message: 'User account is deactivated' },
      })
    }

    // 4. Attach context to request
    req.user = {
      userId: profile.id,
      orgId: normalizeOptionalUuid(profile.organization_id),
      role: profile.role,
      email: user.email,
      profile: profile
    }

    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    if (isSupabaseReachabilityError(error)) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        error: {
          code: 'SUPABASE_UNAVAILABLE',
          message:
            'Cannot reach Supabase Auth right now (network/DNS). Check your connection and SUPABASE_URL, then retry.',
        },
      })
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred during authentication' },
    })
  }
}

/**
 * Middleware to restrict access to GCC roles only
 */
export const isAdmin = (req, res, next) => {
  const role = req.user?.role
  if (!role || (!role.startsWith('gcc_') && !role.startsWith('sp_') && role !== 'admin')) {
    console.warn(`[Auth] Admin access denied for role: ${role}`)
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'ACCESS_DENIED', message: 'This action requires administrative privileges' }
    })
  }
  next()
}

