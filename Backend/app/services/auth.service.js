import { supabase } from '../config/supabase.js'

/**
 * Auth Service - Interacts directly with Supabase Auth
 */
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const refreshSession = async (refresh_token) => {
  return await supabase.auth.refreshSession({ refresh_token })
}

export const requestPasswordReset = async (email) => {
  return await supabase.auth.resetPasswordForEmail(email)
}

export const updatePassword = async (password) => {
  return await supabase.auth.updateUser({ password })
}

export const getUserFromToken = async (token) => {
  return await supabase.auth.getUser(token)
}

export const getUserProfile = async (userId) => {
  return await supabase
    .from('profiles')
    .select('id, organization_id, role, is_active, organizations!profiles_organization_id_fkey(country_code)')

    .eq('id', userId)
    .single()
}

