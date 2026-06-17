import { supabaseAdmin } from '../config/supabase.js'

/**
 * User Service - Handles interactions with profiles and auth users
 */

export const listAllUsers = async () => {
  return await supabaseAdmin
    .from('profiles')
    .select('*')
}

export const listUsersByOrg = async (orgId) => {
  if (!orgId) return []
  return await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('organization_id', orgId)
}

export const listUsersByOrgs = async (orgIds) => {
  return await supabaseAdmin
    .from('profiles')
    .select('*')
    .in('organization_id', orgIds)
}

export const getUserById = async (userId) => {
  return await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export const createUserProfile = async (profileData) => {
  return await supabaseAdmin
    .from('profiles')
    .insert(profileData)
    .select()
    .single()
}

export const updateUserProfile = async (userId, updateData) => {
  return await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()
}

export const deactivateUser = async (userId) => {
  return await supabaseAdmin
    .from('profiles')
    .update({ is_active: false })
    .eq('id', userId)
}

// For Sales Partner specifics
export const getSPClientAssignments = async (spUserId) => {
  return await supabaseAdmin
    .from('sp_client_assignments')
    .select('client_org_id')
    .eq('sp_user_id', spUserId)
}

/** Deal scope for SP Sub (own deals / assigned agents). */
export const getSpSubDeals = async (spSubUserId) => {
  return await supabaseAdmin
    .from('sp_sub_deals')
    .select('client_org_id, agent_id')
    .eq('sp_sub_user_id', spSubUserId)
}
