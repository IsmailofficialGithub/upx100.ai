import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'

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
  const { email, role, organization_id, full_name } = req.body
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
  }

  // Note: Actual Auth creation requires service_role and should be done via admin API
  // For now, returning success placeholder or simple profile insert if auth exists
  return res.status(StatusCodes.NOT_IMPLEMENTED).json({ 
    message: 'User creation logic depends on Supabase Admin API setup' 
  })
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
