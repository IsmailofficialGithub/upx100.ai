import { supabaseAdmin, supabaseAuth } from '../config/supabase.js'
import * as authService from '../services/auth.service.js'

jest.mock('../config/supabase.js', () => ({
  supabaseAdmin: {
    auth: { getUser: jest.fn() },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  },
  supabaseAuth: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn()
    }
  }
}))

describe('auth service client isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses the dedicated auth client for session-changing operations', async () => {
    supabaseAuth.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null })

    await authService.signIn('client@example.com', 'password')

    expect(supabaseAuth.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'client@example.com',
      password: 'password'
    })
    expect(supabaseAdmin.auth.getUser).not.toHaveBeenCalled()
  })

  it('keeps token verification on the service-role client', async () => {
    supabaseAdmin.auth.getUser.mockResolvedValue({ data: { user: {} }, error: null })

    await authService.getUserFromToken('access-token')

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith('access-token')
  })
})
