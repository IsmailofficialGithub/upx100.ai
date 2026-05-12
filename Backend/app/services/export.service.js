import { supabaseAdmin } from '../config/supabase.js';
import * as adminService from './admin.service.js';

/**
 * @param {string[]|null} targetOrgIds null = all orgs; array of ids = scoped
 */
const applyOrgFilter = (query, targetOrgIds) => {
  if (targetOrgIds && targetOrgIds.length > 0) {
    return query.in('organization_id', targetOrgIds);
  }
  return query;
};

/**
 * Rolling window: last `days` days through end of today (UTC).
 */
export const getDefaultPeriod = (days = 30) => {
  const to = new Date();
  to.setUTCHours(23, 59, 59, 999);
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - days);
  from.setUTCHours(0, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
};

export const buildMonthlyExport = async ({
  targetOrgIds,
  fromIso,
  toIso,
  includeAdminSnapshot,
}) => {
  // Note: no FK call_logs→organizations / leads→organizations in DB, so we cannot use
  // select('..., organizations(name)') — PostgREST would 500. Resolve names after fetch.
  const callBase = () => {
    let q = supabaseAdmin
      .schema('inbound')
      .from('call_logs')
      .select('id, organization_id, status, duration_sec, caller_number, created_at, agents(name)')
      .gte('created_at', fromIso)
      .lte('created_at', toIso)
      .order('created_at', { ascending: false })
      .limit(400);
    return applyOrgFilter(q, targetOrgIds);
  };

  const leadBase = () => {
    let q = supabaseAdmin
      .schema('inbound')
      .from('leads')
      .select('id, organization_id, name, email, phone, status, notes, meeting_time, created_at, agents(name)')
      .gte('created_at', fromIso)
      .lte('created_at', toIso)
      .order('created_at', { ascending: false })
      .limit(400);
    return applyOrgFilter(q, targetOrgIds);
  };

  const countCalls = () => {
    let q = supabaseAdmin
      .schema('inbound')
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fromIso)
      .lte('created_at', toIso);
    return applyOrgFilter(q, targetOrgIds);
  };

  const countLeads = () => {
    let q = supabaseAdmin
      .schema('inbound')
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fromIso)
      .lte('created_at', toIso);
    return applyOrgFilter(q, targetOrgIds);
  };

  const [
    { data: callRows, error: callErr },
    { data: leadRows, error: leadErr },
    { count: callCount, error: callCountErr },
    { count: leadCount, error: leadCountErr },
  ] = await Promise.all([callBase(), leadBase(), countCalls(), countLeads()]);

  if (callErr || leadErr || callCountErr || leadCountErr) {
    const err = callErr || leadErr || callCountErr || leadCountErr;
    return { error: err };
  }

  const calls = callRows || [];
  const leads = leadRows || [];

  const orgIds = [
    ...new Set(
      [...calls, ...leads]
        .map((r) => r.organization_id)
        .filter(Boolean),
    ),
  ];
  const orgNameById = {};
  if (orgIds.length > 0) {
    const { data: orgRows, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id, name')
      .in('id', orgIds);
    if (orgErr) {
      return { error: orgErr };
    }
    (orgRows || []).forEach((o) => {
      orgNameById[o.id] = o.name;
    });
  }
  const totalDurationSec = calls.reduce((acc, r) => acc + (r.duration_sec || 0), 0);
  const successMeetings = leads.filter((l) => l.status === 'success').length;
  const statusBuckets = calls.reduce((acc, c) => {
    const k = c.status || 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  let adminSnapshot = null;
  if (includeAdminSnapshot) {
    adminSnapshot = await adminService.getGlobalStats(targetOrgIds);
  }

  return {
    data: {
      period: { from: fromIso, to: toIso },
      summary: {
        totalCalls: callCount ?? calls.length,
        totalLeads: leadCount ?? leads.length,
        successMeetings,
        totalDurationSec,
        totalDurationLabel: formatDuration(totalDurationSec),
        callStatusBreakdown: statusBuckets,
      },
      callLogs: calls.map((r) => summarizeCall(r, orgNameById)),
      leads: leads.map((r) => summarizeLead(r, orgNameById)),
      adminSnapshot,
    },
  };
};

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

function summarizeCall(row, orgNameById) {
  const orgName =
    (row.organization_id && orgNameById[row.organization_id]) || '—';
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    durationSec: row.duration_sec,
    caller: row.caller_number,
    agent: row.agents?.name || '—',
    organization: orgName,
  };
}

function summarizeLead(row, orgNameById) {
  const orgName =
    (row.organization_id && orgNameById[row.organization_id]) || '—';
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    company: row.notes || '—',
    meetingTime: row.meeting_time,
    agent: row.agents?.name || '—',
    organization: orgName,
  };
}
