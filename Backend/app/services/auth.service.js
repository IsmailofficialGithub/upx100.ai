import { supabaseAdmin } from '../config/supabase.js'

/**
 * Auth Service - Interacts directly with Supabase Auth
 */
export const signIn = async (email, password) => {
  return await supabaseAdmin.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabaseAdmin.auth.signOut()
}

export const refreshSession = async (refresh_token) => {
  return await supabaseAdmin.auth.refreshSession({ refresh_token })
}

export const requestPasswordReset = async (email) => {
  return await supabaseAdmin.auth.resetPasswordForEmail(email)
}

export const updatePassword = async (password) => {
  return await supabaseAdmin.auth.updateUser({ password })
}

export const getUserFromToken = async (token) => {
  return await supabaseAdmin.auth.getUser(token)
}

export const getUserProfile = async (userId) => {
  return await supabaseAdmin
    .from('profiles')
    .select('id, organization_id, role, is_active, organizations!profiles_organization_id_fkey(country_code)')

    .eq('id', userId)
    .single()
}

