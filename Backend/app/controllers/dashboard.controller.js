import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Get unified dashboard stats for a client or SP
 */
export const getStats = async (req, res) => {
  try {
    const { orgId } = req.user

    // 1. Get Call Logs
    const { data: callLogs } = await supabaseAdmin.schema('inbound')
      .from('call_logs')
      .select('*')
      .eq('organization_id', orgId)

    // 2. Get Leads
    const { data: leads } = await supabaseAdmin.schema('inbound')
      .from('leads')
      .select('*')
      .eq('organization_id', orgId)

    // 3. Get Phone Numbers count
    const { count: totalNumbers } = await supabaseAdmin.schema('inbound')
      .from('phone_numbers')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .is('deleted_at', null)

    // 4. Get Agents count
    const { count: totalAgents } = await supabaseAdmin.schema('inbound')
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .is('deleted_at', null)

    // Calculate aggregated metrics
    const totalOutreach = callLogs?.length || 0;
    const totalDurationSec = (callLogs || []).reduce((acc, log) => acc + (log.duration_sec || 0), 0);
    const totalHours = Math.floor(totalDurationSec / 3600);
    const totalMins = Math.floor((totalDurationSec % 3600) / 60);

    const totalMeetings = leads?.filter(l => l.status === 'success').length || 0;
    const pipelineValue = totalMeetings * 5000; 
    const hoursSaved = Math.round((totalOutreach * 5) / 60);

    // 5. Get Recent/Live Calls
    const { data: recentCalls } = await supabaseAdmin.schema('inbound')
      .from('call_logs')
      .select('*, agents(name)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(3)

    const formattedLiveCalls = (recentCalls || []).map(call => {
      // Basic transcript parsing: assuming format "Speaker: Text" per line
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

    // 6. Calculate outreachActivity (Last 7 days for daily)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const dailyActivity = last7Days.map(date => {
      const count = (callLogs || []).filter(log => log.created_at.startsWith(date)).length;
      return { label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), count };
    });

    const stats = {
      metrics: {
        outreach: { label: 'Call Logs', value: totalOutreach, change: '' },
        agents: { label: 'Agents Assigned', value: totalAgents || 0, change: '' },
        phoneNumbers: { label: 'Numbers Imported', value: totalNumbers || 0, change: '' },
        callTime: { label: 'Total Call Time', value: `${totalHours}h ${totalMins}m`, change: '' }
      },
      liveCalls: formattedLiveCalls,
      funnelData: [
        { stage: 'Total Calls', count: totalOutreach, percentage: 100, color: 'hsl(var(--muted-foreground))' },
        { stage: 'Connected', count: (callLogs || []).filter(c => c.status === 'success' || c.status === 'follow_up').length, percentage: totalOutreach > 0 ? Math.round(((callLogs || []).filter(c => c.status === 'success' || c.status === 'follow_up').length / totalOutreach) * 100) : 0, color: 'hsl(var(--accent-blue))' },
        { stage: 'Qualified Leads', count: leads?.length || 0, percentage: totalOutreach > 0 ? Math.round(((leads?.length || 0) / totalOutreach) * 100) : 0, color: 'hsl(var(--primary))' },
        { stage: 'Success', count: totalMeetings, percentage: totalOutreach > 0 ? Math.round((totalMeetings / totalOutreach) * 100) : 0, color: '#00ff88' }
      ],
      outreachActivity: {
        daily: { labels: dailyActivity.map(a => a.label), data: dailyActivity.map(a => a.count) },
        weekly: { labels: ['W1', 'W2', 'W3', 'W4'], data: [0, 0, 0, totalOutreach] },
        monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [0, 0, 0, 0, 0, totalOutreach] }
      },
      regionalData: [], // Would need lead address data
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

    return res.status(StatusCodes.OK).json({ data: stats })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
