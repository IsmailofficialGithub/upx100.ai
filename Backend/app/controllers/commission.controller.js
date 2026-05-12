import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'
import * as userService from '../services/user.service.js'

/** PostgREST: table not exposed / not in schema cache (usually table does not exist yet). */
function isMissingCommissionsTable(error) {
  if (!error) return false
  if (error.code === 'PGRST205') return true
  const msg = String(error.message || '')
  return /commissions/i.test(msg) && (/schema cache/i.test(msg) || /not find/i.test(msg))
}

/** Demo rows when DB migration has not been applied (same shape as public.commissions). */
function buildDemoCommissionRows(spUserId) {
  const orgId = '00000000-0000-4000-a000-00000000d001'
  return [
    {
      id: '00000000-0000-4000-a000-00000000c001',
      sp_user_id: spUserId,
      organization_id: orgId,
      period: 'June 2026',
      collected_mrr: 18250,
      rate: 20,
      amount: 3650,
      status: 'pending',
      created_at: '2026-06-01T12:00:00.000Z',
    },
    {
      id: '00000000-0000-4000-a000-00000000c002',
      sp_user_id: spUserId,
      organization_id: orgId,
      period: 'May 2026',
      collected_mrr: 15420,
      rate: 20,
      amount: 3084,
      status: 'paid',
      created_at: '2026-05-01T12:00:00.000Z',
    },
    {
      id: '00000000-0000-4000-a000-00000000c003',
      sp_user_id: spUserId,
      organization_id: orgId,
      period: 'April 2026',
      collected_mrr: 12100,
      rate: 18,
      amount: 2178,
      status: 'paid',
      created_at: '2026-04-01T12:00:00.000Z',
    },
    {
      id: '00000000-0000-4000-a000-00000000c004',
      sp_user_id: spUserId,
      organization_id: orgId,
      period: 'March 2026',
      collected_mrr: 9800,
      rate: 18,
      amount: 1764,
      status: 'at_risk',
      created_at: '2026-03-01T12:00:00.000Z',
    },
  ]
}

const DEMO_ADMIN_ROWS = [
  {
    id: '00000000-0000-4000-a000-00000000b001',
    sp_user_id: '00000000-0000-4000-a000-00000000a001',
    organization_id: '00000000-0000-4000-a000-00000000d001',
    period: 'June 2026',
    collected_mrr: 18250,
    rate: 20,
    amount: 3650,
    status: 'pending',
    created_at: '2026-06-01T12:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-a000-00000000b002',
    sp_user_id: '00000000-0000-4000-a000-00000000a001',
    organization_id: '00000000-0000-4000-a000-00000000d001',
    period: 'May 2026',
    collected_mrr: 15420,
    rate: 20,
    amount: 3084,
    status: 'paid',
    created_at: '2026-05-01T12:00:00.000Z',
  },
]

/**
 * Get commissions for the authenticated user (SP) or all rows for GCC admin.
 * Rows live in public.commissions (see migrations/11_commissions.sql).
 */
export const getCommissions = async (req, res) => {
  try {
    const { role, userId, orgId } = req.user

    if (!['sp_primary', 'sp_sub', 'gcc_admin'].includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Access denied to commissions' }
      })
    }

    if (role === 'gcc_admin') {
      const { data, error } = await supabaseAdmin
        .from('commissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (isMissingCommissionsTable(error)) {
          console.warn(
            '[commissions] Table missing; returning demo rows. Run Backend/app/migrations/11_commissions.sql in the Supabase SQL editor, or: npm run db:commissions (requires DATABASE_URL).'
          )
          return res.status(StatusCodes.OK).json({ data: DEMO_ADMIN_ROWS })
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

    const { data: rows, error } = await supabaseAdmin
      .from('commissions')
      .select('*')
      .eq('sp_user_id', spId)
      .order('created_at', { ascending: false })

    if (error) {
      if (isMissingCommissionsTable(error)) {
        console.warn(
          '[commissions] Table missing; returning demo rows. Run Backend/app/migrations/11_commissions.sql in the Supabase SQL editor, or: npm run db:commissions (requires DATABASE_URL).'
        )
        return res.status(StatusCodes.OK).json({ data: buildDemoCommissionRows(spId) })
      }
      console.error('[commissions] sp list error', error)
      return res.status(StatusCodes.OK).json({ data: [] })
    }

    const { data: assignments } = await userService.getSPClientAssignments(spId)
    const targetOrgIds = new Set((assignments || []).map((a) => a.client_org_id))

    // If the SP has explicit client assignments, only show commissions for those clients.
    // If none (legacy / empty), show every commission row for this SP so seeded data still appears.
    let data = rows || []
    if (targetOrgIds.size > 0) {
      data = data.filter((r) => targetOrgIds.has(r.organization_id))
    }

    return res.status(StatusCodes.OK).json({ data })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
