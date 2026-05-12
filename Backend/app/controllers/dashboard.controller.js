import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'
import * as userService from '../services/user.service.js'
import { aggregateRegionalFromCallLogs } from '../utils/usCallerRegion.js'

/**
 * Get unified dashboard stats for a client or SP
 */
export const getStats = async (req, res) => {
  try {
    const { role, orgId, userId } = req.user
    let targetOrgIds = [orgId]

    // GCC Admin/Reviewer can see all (or we could limit them, but for now they see all)
    // SP can see assigned orgs
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      // For now, GCC see everything. In a real large system, we'd paginate or filter.
      // But let's assume they want a global view if no org context is provided.
      // If orgId is 000...003 (system org), they see all.
      if (orgId === '00000000-0000-4000-a000-000000000003') {
        targetOrgIds = [] // Signal to fetch all
      }
    } else if (['sp_primary', 'sp_sub'].includes(role)) {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      targetOrgIds = assignments?.map(a => a.client_org_id) || []
    }

    const buildQuery = (schema, table) => {
      let query = supabaseAdmin.schema(schema).from(table).select('*')
      if (targetOrgIds.length > 0) {
        query = query.in('organization_id', targetOrgIds)
      }
      return query
    }

    // 1. Get Call Logs
    const { data: callLogs } = await buildQuery('inbound', 'call_logs')

    // 2. Get Leads
    const { data: leads } = await buildQuery('inbound', 'leads')

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
    const { data: recentCalls } = await buildQuery('inbound', 'call_logs')
      .select('*, agents(name)')
      .order('created_at', { ascending: false })
      .limit(5) // Increased for multi-org view

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
    const leadCount = leads?.length || 0
    const pctOfCalls = (n) =>
      totalOutreach > 0 ? Math.round((n / totalOutreach) * 100) : null

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
      emailStats: { sent: 0, openRate: 0, replyRate: 0 },
      benchmarks: {
        meetings: { yours: totalOutreach > 0 ? (totalMeetings / 4).toFixed(1) : 0, network: 2.1, top25: 4.2, unit: '/week' },
        connection: { yours: totalOutreach > 0 ? Math.round(((callLogs || []).filter(c => c.status === 'success').length / totalOutreach) * 100) : 0, network: 42, top25: 68, unit: '%' },
        response: { yours: 0, network: 8, top25: 18, unit: '%' }
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
