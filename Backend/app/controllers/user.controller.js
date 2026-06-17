import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Whether the caller may read the target profile (single-user fetch).
 */
const canReadUserProfile = async (caller, target) => {
  if (caller.role === 'gcc_admin' || caller.role === 'gcc_reviewer') {
    return true
  }

  if (caller.role === 'sp_sub') {
    if (target.id === caller.userId) return true
    if (target.organization_id !== caller.orgId) return false
    return target.role === 'sp_primary' || target.role === 'sp_sub'
  }

  if (caller.role === 'sp_primary') {
    if (target.organization_id === caller.orgId) {
      return ['sp_primary', 'sp_sub'].includes(target.role)
    }
    const { data: assignments } = await userService.getSPClientAssignments(caller.userId)
    const allowedOrgs = (assignments || []).map((a) => a.client_org_id)
    return allowedOrgs.includes(target.organization_id)
  }

  if (caller.role === 'client_admin' || caller.role === 'client_sub') {
    return target.organization_id === caller.orgId
  }

  return false
}

/**
 * Whether the caller may update the target profile (field allowlist applied separately).
 */
const canManageUserRecord = async (caller, target) => {
  if (caller.role === 'gcc_admin') {
    return true
  }

  if (caller.role === 'sp_primary') {
    return (
      target.role === 'sp_sub' &&
      target.organization_id === caller.orgId
    )
  }

  if (caller.role === 'client_admin') {
    return (
      target.role === 'client_sub' &&
      target.organization_id === caller.orgId
    )
  }

  if (caller.role === 'sp_sub' || caller.role === 'client_sub') {
    return target.id === caller.userId
  }

  return false
}

const pickAllowedUpdates = (caller, body) => {
  const forbidden = ['id', 'email']
  const safe = { ...body }
  for (const k of forbidden) {
    delete safe[k]
  }

  if (caller.role === 'gcc_admin') {
    return safe
  }

  delete safe.role
  delete safe.organization_id

  if (caller.role === 'sp_primary' || caller.role === 'client_admin') {
    const allowed = {}
    if (body.full_name !== undefined) allowed.full_name = body.full_name
    if (body.is_active !== undefined) allowed.is_active = body.is_active
    return allowed
  }

  if (caller.role === 'sp_sub' || caller.role === 'client_sub') {
    const allowed = {}
    if (body.full_name !== undefined) allowed.full_name = body.full_name
    return allowed
  }

  return {}
}

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
  } else if (role === 'sp_primary' || role === 'sp_sub') {
    const { data, error } = await userService.listUsersByOrg(orgId)
    if (error) throw error
    const spRoles = new Set(['sp_primary', 'sp_sub'])
    users = (data || []).filter((u) => spRoles.has(u.role))
    if (role === 'sp_sub') {
      users = users.filter((u) => u.id === userId)
    }
  } else if (role === 'client_admin' || role === 'client_sub') {
    const { data, error } = await userService.listUsersByOrg(orgId)
    if (error) throw error
    const clientRoles = new Set(['client_admin', 'client_sub'])
    users = (data || []).filter((u) => clientRoles.has(u.role))
    if (role === 'client_sub') {
      users = users.filter((u) => u.id === userId)
    }
  } else {
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

  const allowed = await canReadUserProfile(req.user, data)
  if (!allowed) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Access denied' }
    })
  }

  return res.json({ data })
}

export const createUser = async (req, res) => {
  const { email, password, role, organization_id, full_name } = req.body
  const creatorRole = req.user.role

  if (creatorRole === 'gcc_admin') {
    // GCC Admin can create any role
  } else if (creatorRole === 'sp_primary') {
    if (role !== 'sp_sub') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Sales Partner Primary can only create Sales Partner Sub-users (Sales Reps)' }
      })
    }
  } else if (creatorRole === 'client_admin') {
    if (role !== 'client_sub') {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Client Admin can only create Client Sub-users (SDRs/Team Leads)' }
      })
    }
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'You do not have permission to create users' }
    })
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'DefaultPass123!',
      email_confirm: true,
      user_metadata: { full_name, role }
    })

    if (authError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'AUTH_ERROR', message: authError.message }
      })
    }

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
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: {
          code: 'PROFILE_ERROR',
          message: 'Failed to create user profile',
          details: profileError.message,
          hint: profileError.hint
        }
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
  const { data: target, error: fetchErr } = await userService.getUserById(userId)

  if (fetchErr || !target) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'User not found' }
    })
  }

  const mayManage = await canManageUserRecord(req.user, target)
  if (!mayManage) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'You do not have permission to update this user' }
    })
  }

  const updateData = pickAllowedUpdates(req.user, req.body)
  if (Object.keys(updateData).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'INVALID_BODY', message: 'No permitted fields to update' }
    })
  }

  const { data, error } = await userService.updateUserProfile(userId, updateData)
  if (error) throw error

  return res.json({ message: 'User updated', data })
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params
  const caller = req.user

  if (caller.userId === userId && caller.role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'You cannot deactivate your own account' }
    })
  }

  const { data: target, error: fetchErr } = await userService.getUserById(userId)

  if (fetchErr || !target) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'User not found' }
    })
  }

  if (caller.role === 'gcc_admin') {
    await userService.deactivateUser(userId)
    return res.json({ message: 'User deactivated' })
  }

  if (caller.role === 'sp_primary') {
    if (target.role !== 'sp_sub' || target.organization_id !== caller.orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You can only deactivate sub-users in your partner team' }
      })
    }
    await userService.deactivateUser(userId)
    return res.json({ message: 'User deactivated' })
  }

  if (caller.role === 'client_admin') {
    if (target.role !== 'client_sub' || target.organization_id !== caller.orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You can only deactivate sub-users in your organization' }
      })
    }
    await userService.deactivateUser(userId)
    return res.json({ message: 'User deactivated' })
  }

  return res.status(StatusCodes.FORBIDDEN).json({
    error: { code: 'FORBIDDEN', message: 'You do not have permission to deactivate users' }
  })
}
