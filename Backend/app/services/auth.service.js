import { supabaseAdmin, supabaseAuth } from '../config/supabase.js'

/**
 * Auth Service - Interacts directly with Supabase Auth
 */
export const signIn = async (email, password) => {
  return await supabaseAuth.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabaseAuth.auth.signOut()
}

export const refreshSession = async (refresh_token) => {
  return await supabaseAuth.auth.refreshSession({ refresh_token })
}

export const requestPasswordReset = async (email) => {
  return await supabaseAuth.auth.resetPasswordForEmail(email)
}

export const updatePassword = async (password) => {
  return await supabaseAuth.auth.updateUser({ password })
}

export const getUserFromToken = async (token) => {
  return await supabaseAdmin.auth.getUser(token)
}

export const getUserProfile = async (userId) => {
  return await supabaseAdmin
    .from('profiles')
    .select('id, organization_id, role, is_active, full_name, organizations!profiles_organization_id_fkey(name, country_code)')
    .eq('id', userId)
    .single()
}
