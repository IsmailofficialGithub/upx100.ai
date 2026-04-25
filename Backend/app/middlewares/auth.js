import * as authService from '../services/auth.service.js'
import { StatusCodes } from 'http-status-codes'

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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired session' }
      })
    }

    // 2. Lookup the user's profile for role and org info
    const { data: profile, error: profileError } = await authService.getUserProfile(user.id)

    if (profileError || !profile) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found' }
      })
    }

    // 3. Check if user is active
    if (!profile.is_active) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'ACCOUNT_INACTIVE', message: 'User account is deactivated' }
      })
    }

    // 4. Attach context to request
    req.user = {
      userId: profile.id,
      orgId: profile.organization_id,
      role: profile.role,
      email: user.email,
      profile: profile
    }

    next()
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred during authentication' }
    })
  }
}

/**
 * Middleware to restrict access to GCC roles only
 */
export const isAdmin = (req, res, next) => {
  if (!req.user.role.startsWith('gcc_')) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'ACCESS_DENIED', message: 'This action requires administrative privileges' }
    })
  }
  next()
}

