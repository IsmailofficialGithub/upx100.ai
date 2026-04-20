import * as authService from '../services/auth.service.js'
import { StatusCodes } from 'http-status-codes'

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_INPUT', message: 'Email and password are required' }
    })
  }

  const { data, error } = await authService.signIn(email, password)

  if (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: { code: 'AUTH_FAILED', message: error.message }
    })
  }

  return res.status(StatusCodes.OK).json({
    message: 'Login successful',
    data: {
      user: data.user,
      session: data.session
    }
  })
}

export const logout = async (req, res) => {
  const { error } = await authService.signOut()

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'LOGOUT_FAILED', message: error.message }
    })
  }

  return res.json({ message: 'Logged out successfully' })
}

export const refresh = async (req, res) => {
  const { refresh_token } = req.body

  if (!refresh_token) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_TOKEN', message: 'Refresh token is required' }
    })
  }

  const { data, error } = await authService.refreshSession(refresh_token)

  if (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: { code: 'REFRESH_FAILED', message: error.message }
    })
  }

  return res.json({
    data: {
      user: data.user,
      session: data.session
    }
  })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_EMAIL', message: 'Email is required' }
    })
  }

  const { error } = await authService.requestPasswordReset(email)

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'RESET_FAILED', message: error.message }
    })
  }

  return res.json({ message: 'Password reset email sent' })
}

export const resetPassword = async (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_PASSWORD', message: 'New password is required' }
    })
  }

  const { error } = await authService.updatePassword(password)

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'UPDATE_FAILED', message: error.message }
    })
  }

  return res.json({ message: 'Password updated successfully' })
}
