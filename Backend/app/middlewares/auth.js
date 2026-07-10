import * as authService from '../services/auth.service.js'
import { StatusCodes } from 'http-status-codes'

import crypto from 'crypto'

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

const decodeJwt = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    return JSON.parse(Buffer.from(parts[1], 'base64').toString())
  } catch (err) {
    return null
  }
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

    // 1. Decode JWT locally to extract remaining TTL and create a hashed cache key
    const payload = decodeJwt(token)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const redisKey = `auth:session:${tokenHash}`
    const nowSec = Math.floor(Date.now() / 1000)
    const ttl = payload && payload.exp ? payload.exp - nowSec : 0

    // 2. Try fetching cached auth context from Redis
    if (ttl > 0) {
      try {
        const redis = (await import('../config/redis.js')).default
        if (redis.status === 'ready') {
          const cached = await redis.get(redisKey)
          if (cached) {
            req.user = JSON.parse(cached)
            return next()
          }
        }
      } catch (cacheErr) {
        console.error('[auth] Redis fetch error:', cacheErr)
      }
    }

    // 3. Verify JWT with Supabase service (Cache Miss)
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

    // 4. Lookup the user's profile for role and org info
    const { data: profile, error: profileError } = await authService.getUserProfile(user.id)

    if (profileError || !profile) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' },
      })
    }

    // 5. Check if user is active
    if (!profile.is_active) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'ACCOUNT_INACTIVE', message: 'User account is deactivated' },
      })
    }

    // 6. Build and attach user context
    const isGcc = profile.role === 'gcc_admin' || profile.role === 'gcc_reviewer'
    const userContext = {
      userId: profile.id,
      orgId: normalizeOptionalUuid(profile.organization_id),
      role: profile.role,
      email: user.email,
      canInbound: isGcc ? true : profile.can_inbound !== false,
      canOutbound: isGcc ? true : profile.can_outbound !== false,
      profile: profile
    }

    req.user = userContext

    // 7. Cache verified session context in Redis
    if (ttl > 0) {
      try {
        const redis = (await import('../config/redis.js')).default
        if (redis.status === 'ready') {
          const cacheTtl = Math.min(ttl, 3600) // Cap cache duration at 1 hour
          await redis.set(redisKey, JSON.stringify(userContext), 'EX', cacheTtl)
        }
      } catch (cacheErr) {
        console.error('[auth] Redis store error:', cacheErr)
      }
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

