import { supabase } from '../config/supabase.js'

/**
 * User Service - Handles interactions with profiles and auth users
 */

export const listAllUsers = async () => {
  return await supabase
    .from('profiles')
    .select('*')
}

export const listUsersByOrg = async (orgId) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', orgId)
}

export const listUsersByOrgs = async (orgIds) => {
  return await supabase
    .from('profiles')
    .select('*')
    .in('organization_id', orgIds)
}

export const getUserById = async (userId) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export const createUserProfile = async (profileData) => {
  return await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single()
}

export const updateUserProfile = async (userId, updateData) => {
  return await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()
}

export const deactivateUser = async (userId) => {
  return await supabase
    .from('profiles')
    .update({ is_active: false })
    .eq('id', userId)
}

// For Sales Partner specifics
export const getSPClientAssignments = async (spUserId) => {
  return await supabase
    .from('sp_client_assignments')
    .select('client_org_id')
    .eq('sp_user_id', spUserId)
}
