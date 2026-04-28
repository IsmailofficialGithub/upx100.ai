import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'
import { supabase } from '../config/supabase.js'

/**
 * Get all users based on role-based scoping
 */
export const getUsers = async (req, res) => {
  const { role, orgId, userId } = req.user
  let users

  if (role === 'gcc_admin') {
    const { data, error } = await userService.listAllUsers()
    if (error) throw error
    users = data
  } 
  else if (role === 'sp_primary') {
    const { data: assignments, error: assignError } = await userService.getSPClientAssignments(userId)
    if (assignError) throw assignError
    
    const clientOrgIds = assignments.map(a => a.client_org_id)
    const { data, error } = await userService.listUsersByOrgs(clientOrgIds)
    if (error) throw error
    users = data
  }
  else if (role === 'client_admin') {
    const { data, error } = await userService.listUsersByOrg(orgId)
    if (error) throw error
    users = data
  }
  else {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions to view users' }
    })
  }

  return res.json({ data: users })
}

/**
 * Get single user profile
 */
export const getUser = async (req, res) => {
  const { userId } = req.params
  const { data, error } = await userService.getUserById(userId)

  if (error || !data) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'User not found' }
    })
  }

  // Scoping check
  const caller = req.user
  if (caller.role !== 'gcc_admin' && data.organization_id !== caller.orgId) {
    // If SP Primary, check if the user belongs to one of their assigned orgs
    if (caller.role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(caller.userId)
      const allowedOrgs = assignments.map(a => a.client_org_id)
      if (!allowedOrgs.includes(data.organization_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
  }

  return res.json({ data })
}

/**
 * Placeholder for user creation logic
 * Real implementation would involve supabase.auth.admin.createUser
 */
export const createUser = async (req, res) => {
  const { email, password, role, organization_id, full_name } = req.body
  const creatorRole = req.user.role

  // RBAC validation as per matrix
  if (creatorRole === 'gcc_admin') {
    // Can create any role
  } else if (creatorRole === 'sp_primary') {
    if (role !== 'sp_sub') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Sales Partner Primary can only create SP Sub-users' }
      })
    }
  } else if (creatorRole === 'client_admin') {
    if (role !== 'client_sub') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Client Admin can only create Client Sub-users' }
      })
    }
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'You do not have permission to create users' }
    })
  }

  try {
    // 1. Create Auth User using Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: password || 'DefaultPass123!', // Require changing on first login in real prod
      email_confirm: true,
      user_metadata: { full_name, role }
    })

    if (authError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'AUTH_ERROR', message: authError.message }
      })
    }

    // 2. Create Public Profile
    const profileData = {
      id: authData.user.id,
      organization_id: creatorRole === 'gcc_admin' ? organization_id : req.user.orgId,
      email,
      full_name,
      role,
      is_active: true
    }

    const { data: profile, error: profileError } = await userService.createUserProfile(profileData)

    if (profileError) {
      // Cleanup auth user if profile fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: { code: 'PROFILE_ERROR', message: 'Failed to create user profile' }
      })
    }

    return res.status(StatusCodes.CREATED).json({ 
      message: 'User created successfully',
      data: profile
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { code: 'SERVER_ERROR', message: error.message }
    })
  }
}

export const updateUser = async (req, res) => {
  const { userId } = req.params
  const updateData = req.body

  const { data, error } = await userService.updateUserProfile(userId, updateData)
  if (error) throw error

  return res.json({ message: 'User updated', data })
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params
  await userService.deactivateUser(userId)
  return res.json({ message: 'User deactivated' })
}
