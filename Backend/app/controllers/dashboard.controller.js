import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'
import * as userService from '../services/user.service.js'
import { aggregateRegionalFromCallLogs } from '../utils/usCallerRegion.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Get unified dashboard stats for a client or SP
 */
export const getStats = async (req, res) => {
  try {
    const { role, orgId, userId } = req.user
    let targetOrgIds = [orgId]
    let spSubDeals = null

    const dealAllowsRow = (deals, row) =>
      (deals || []).some(
        (d) =>
          d.client_org_id === row.organization_id &&
          (row.agent_id == null || d.agent_id === row.agent_id)
      )

    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      const q = req.query?.organization_id
      if (q && UUID_RE.test(String(q))) {
        targetOrgIds = [String(q)]
      } else if (orgId === '00000000-0000-4000-a000-000000000003') {
        targetOrgIds = []
      } else {
        targetOrgIds = []
      }
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      targetOrgIds = assignments?.map((a) => a.client_org_id) || []
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      spSubDeals = deals || []
      targetOrgIds = [...new Set(spSubDeals.map((d) => d.client_org_id))]
      if (targetOrgIds.length === 0) {
        targetOrgIds = ['00000000-0000-0000-0000-000000000001']
      }
    }

    const buildQuery = (schema, table) => {
      let query = supabaseAdmin.schema(schema).from(table).select('*')
      if (targetOrgIds.length > 0) {
        query = query.in('organization_id', targetOrgIds)
      }
      return query
    }

    // 1. Get Call Logs
    const { data: callLogsRaw } = await buildQuery('inbound', 'call_logs')
    let callLogs = callLogsRaw || []
    if (role === 'sp_sub' && spSubDeals?.length) {
      callLogs = callLogs.filter((row) => dealAllowsRow(spSubDeals, row))
    }

    // 2. Get Leads
    const { data: leadsRaw } = await buildQuery('inbound', 'leads')
    let leads = leadsRaw || []
    if (role === 'sp_sub' && spSubDeals?.length) {
      leads = leads.filter((row) => dealAllowsRow(spSubDeals, row))
    }

    // 3. Get Phone Numbers count
    const { count: totalNumbers } = await buildQuery('inbound', 'phone_numbers')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // 4. Get Agents count
    const { count: totalAgents } = await buildQuery('inbound', 'agents')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // Calculate aggregated metrics
    const totalOutreach = callLogs?.length || 0;
    const totalDurationSec = (callLogs || []).reduce((acc, log) => acc + (log.duration_sec || 0), 0);
    const totalHours = Math.floor(totalDurationSec / 3600);
    const totalMins = Math.floor((totalDurationSec % 3600) / 60);

    const totalMeetings = leads?.filter(l => l.status === 'success').length || 0;
    // const pipelineValue = totalMeetings * 5000; 
    // const hoursSaved = Math.round((totalOutreach * 5) / 60);

    // 5. Get Recent/Live Calls
    let { data: recentCalls } = await buildQuery('inbound', 'call_logs')
      .select('*, agents(name)')
      .order('created_at', { ascending: false })
      .limit(5)
    recentCalls = recentCalls || []
    if (role === 'sp_sub' && spSubDeals?.length) {
      recentCalls = recentCalls.filter((row) => dealAllowsRow(spSubDeals, row))
    }

    const formattedLiveCalls = (recentCalls || []).map(call => {
      const transcriptLines = (call.transcript || '')
        .split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
          const [speaker, ...rest] = line.split(':');
          return { speaker: speaker.trim(), text: rest.join(':').trim() };
        });

      return {
        id: call.id,
        agent: call.agents?.name || 'AI Agent',
        duration: `${Math.floor(call.duration_sec / 60)}:${(call.duration_sec % 60).toString().padStart(2, '0')}`,
        prospect: call.caller_number || 'Unknown',
        company: 'Inbound Call',
        transcript: transcriptLines.length > 0 ? transcriptLines : [
          { speaker: 'System', text: 'Transcription starting...' },
          { speaker: 'Agent', text: 'Connecting to caller...' }
        ],
        status: call.status
      };
    });

    // 6. Calculate outreachActivity
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const dailyActivity = last7Days.map(date => {
      const count = (callLogs || []).filter(log => log.created_at.startsWith(date)).length;
      return { label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), count };
    });

    const OUTREACH_SERIES_DAYS = 90
    const dayCounts = {}
    for (const log of callLogs || []) {
      const key = log.created_at?.split('T')[0]
      if (!key) continue
      dayCounts[key] = (dayCounts[key] || 0) + 1
    }
    const outreachDaySeries = []
    for (let i = 0; i < OUTREACH_SERIES_DAYS; i++) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (OUTREACH_SERIES_DAYS - 1 - i))
      const key = d.toISOString().split('T')[0]
      outreachDaySeries.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayCounts[key] || 0,
      })
    }

    const connectedCount = (callLogs || []).filter(
      (c) => c.status === 'success' || c.status === 'follow_up'
    ).length
    const successCalls = (callLogs || []).filter((c) => c.status === 'success').length
    const followUpCalls = (callLogs || []).filter((c) => c.status === 'follow_up').length
    const leadCount = leads?.length || 0
    const pctOfCalls = (n) =>
      totalOutreach > 0 ? Math.round((n / totalOutreach) * 100) : null
    const connectionRate = pctOfCalls(connectedCount) ?? 0
    const leadSuccessRate = leadCount > 0 ? Math.round((totalMeetings / leadCount) * 100) : 0
    const avgCallDurationSec =
      totalOutreach > 0 ? Math.round(totalDurationSec / totalOutreach) : 0

    const funnelData =
      totalOutreach <= 0
        ? [
            { stage: 'Total Calls', count: 0, percentage: null, color: 'hsl(var(--muted-foreground))' },
            { stage: 'Connected', count: 0, percentage: null, color: 'hsl(var(--accent-blue))' },
            { stage: 'Qualified Leads', count: 0, percentage: null, color: 'hsl(var(--primary))' },
            { stage: 'Success', count: 0, percentage: null, color: '#00ff88' },
          ]
        : [
            { stage: 'Total Calls', count: totalOutreach, percentage: 100, color: 'hsl(var(--muted-foreground))' },
            {
              stage: 'Connected',
              count: connectedCount,
              percentage: pctOfCalls(connectedCount),
              color: 'hsl(var(--accent-blue))',
            },
            {
              stage: 'Qualified Leads',
              count: leadCount,
              percentage: pctOfCalls(leadCount),
              color: 'hsl(var(--primary))',
            },
            {
              stage: 'Success',
              count: totalMeetings,
              percentage: pctOfCalls(totalMeetings),
              color: '#00ff88',
            },
          ]

    const statsResult = {
      metrics: {
        outreach: { label: 'Call Logs', value: totalOutreach, change: '' },
        agents: { label: 'Agents Assigned', value: totalAgents || 0, change: '' },
        phoneNumbers: { label: 'Numbers Imported', value: totalNumbers || 0, change: '' },
        callTime: { label: 'Total Call Time', value: `${totalHours}h ${totalMins}m`, change: '' }
      },
      liveCalls: formattedLiveCalls,
      funnelData,
      outreachActivity: {
        daily: { labels: dailyActivity.map(a => a.label), data: dailyActivity.map(a => a.count) },
        weekly: { labels: ['W1', 'W2', 'W3', 'W4'], data: [0, 0, 0, totalOutreach] },
        monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [0, 0, 0, 0, 0, totalOutreach] }
      },
      outreachDaySeries,
      regionalData: aggregateRegionalFromCallLogs(callLogs || []),
      leadCallSummary: {
        totalCalls: totalOutreach,
        totalLeads: leadCount,
        connectedCalls: connectedCount,
        successCalls,
        followUpCalls,
        meetingsBooked: totalMeetings,
        connectionRate,
        leadSuccessRate,
        avgCallDurationSec,
        totalCallTime: `${totalHours}h ${totalMins}m`,
      },
      contactsData: (leads || []).map(l => ({
        id: l.id,
        name: l.name,
        company: l.notes || 'Inbound Lead',
        email: l.email,
        phone: l.phone,
        status: l.status,
        dncStatus: 'Clean',
        dateAdded: l.created_at.split('T')[0]
      })),
      meetings: (leads || []).filter(l => l.status === 'success').map(l => ({
        id: l.id,
        date: l.meeting_time ? l.meeting_time.split('T')[0] : 'TBD',
        time: l.meeting_time ? l.meeting_time.split('T')[1].substring(0, 5) : 'TBD',
        company: l.notes || 'Inbound Lead',
        contact: l.name,
        email: l.email,
        status: 'confirmed'
      }))
    }

    return res.status(StatusCodes.OK).json({ data: statsResult })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
