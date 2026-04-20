import { StatusCodes } from 'http-status-codes'

/**
 * Middleware to restrict access to specific roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { 
          code: 'FORBIDDEN', 
          message: 'You do not have permission to perform this action' 
        }
      })
    }
    next()
  }
}

/**
 * Middleware to ensure the resource being accessed belongs to the caller's organization
 * Bypassed by GCC roles and Sales Partner Primary (for assigned clients)
 * Note: More complex SP assignments should be handled in the controller query logic
 */
export const requireSameOrg = (req, res, next) => {
  const { role, orgId: userOrgId } = req.user
  
  // GCC Admin and Reviewer see everything
  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    return next()
  }

  const requestedOrgId = req.params.orgId || req.body.organization_id

  if (!requestedOrgId) {
    return next() // If no orgId is targeted in target params/body, move to controller
  }

  if (userOrgId !== requestedOrgId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { 
        code: 'ORG_MISMATCH', 
        message: 'Access denied: Resource belongs to another organization' 
      }
    })
  }

  next()
}
