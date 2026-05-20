import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'
import * as userService from '../services/user.service.js'
import { resolveScopedTargetOrgIds } from './admin.controller.js'

/** PostgREST: table not exposed / not in schema cache (usually table does not exist yet). */
function isMissingCommissionsTable(error) {
  if (!error) return false
  if (error.code === 'PGRST205') return true
  const msg = String(error.message || '')
  return /commissions/i.test(msg) && (/schema cache/i.test(msg) || /not find/i.test(msg))
}

function applyOrganizationScope(query, targetOrgIds) {
  if (targetOrgIds == null) return query
  if (targetOrgIds.length === 0) return null
  if (targetOrgIds.length === 1) return query.eq('organization_id', targetOrgIds[0])
  return query.in('organization_id', targetOrgIds)
}

/**
 * Get commissions for the authenticated user (SP) or scoped rows for GCC admin.
 * Rows live in public.commissions (see migrations/11_commissions.sql).
 * GCC tenant scope: ?organization_id=<uuid> (via OrgScopePicker / api interceptor).
 */
export const getCommissions = async (req, res) => {
  try {
    const { role, userId, orgId } = req.user

    if (!['sp_primary', 'sp_sub', 'gcc_admin', 'gcc_reviewer'].includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Access denied to commissions' },
      })
    }

    const selectWithOrg =
      '*, organizations!commissions_organization_id_fkey(name, country_code)'

    if (role === 'gcc_admin' || role === 'gcc_reviewer') {
      const targetOrgIds = await resolveScopedTargetOrgIds(req)

      if (Array.isArray(targetOrgIds) && targetOrgIds.length === 0) {
        return res.status(StatusCodes.OK).json({ data: [] })
      }

      let query = supabaseAdmin
        .from('commissions')
        .select(selectWithOrg)
        .order('created_at', { ascending: false })

      query = applyOrganizationScope(query, targetOrgIds)
      if (query === null) {
        return res.status(StatusCodes.OK).json({ data: [] })
      }

      const { data, error } = await query

      if (error) {
        if (isMissingCommissionsTable(error)) {
          console.warn(
            '[commissions] Table missing for scoped admin query. Run Backend/app/migrations/11_commissions.sql (npm run db:commissions). Returning empty — not demo rows.',
          )
          return res.status(StatusCodes.OK).json({
            data: [],
            meta: {
              commissions_available: false,
              message:
                'Commission ledger not configured in this database. Apply migration 11_commissions.sql to enable per-client revenue data.',
            },
          })
        }
        console.error('[commissions] admin list error', error)
        return res.status(StatusCodes.OK).json({ data: [] })
      }

      return res.status(StatusCodes.OK).json({ data: data || [] })
    }

    let spId = userId
    if (role === 'sp_sub') {
      const { data: primary } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', orgId)
        .eq('role', 'sp_primary')
        .single()
      if (primary?.id) spId = primary.id
    }

    const { data: assignments } = await userService.getSPClientAssignments(spId)
    const targetOrgIds = new Set((assignments || []).map((a) => a.client_org_id))

    let query = supabaseAdmin
      .from('commissions')
      .select(selectWithOrg)
      .eq('sp_user_id', spId)
      .order('created_at', { ascending: false })

    if (targetOrgIds.size > 0) {
      query = query.in('organization_id', [...targetOrgIds])
    }

    const { data: rows, error } = await query

    if (error) {
      if (isMissingCommissionsTable(error)) {
        console.warn(
          '[commissions] Table missing for SP query. Run migrations/11_commissions.sql. Returning empty.',
        )
        return res.status(StatusCodes.OK).json({
          data: [],
          meta: { commissions_available: false },
        })
      }
      console.error('[commissions] sp list error', error)
      return res.status(StatusCodes.OK).json({ data: [] })
    }

    return res.status(StatusCodes.OK).json({ data: rows || [] })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message },
    })
  }
}
