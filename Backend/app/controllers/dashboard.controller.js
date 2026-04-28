import { supabase } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Get unified dashboard stats for a client or SP
 */
export const getStats = async (req, res) => {
  try {
    const { orgId } = req.user

    // 1. Get Call Logs
    const { data: callLogs } = await supabase.schema('inbound')
      .from('call_logs')
      .select('*')
      .eq('organization_id', orgId)

    // 2. Get Leads
    const { data: leads } = await supabase.schema('inbound')
      .from('leads')
      .select('*')
      .eq('organization_id', orgId)

    // Calculate aggregated metrics
    const totalOutreach = callLogs?.length || 0;
    const totalMeetings = leads?.filter(l => l.status === 'success').length || 0;
    const pipelineValue = totalMeetings * 5000; 
    const hoursSaved = Math.round((totalOutreach * 5) / 60);

    // 3. Get Recent/Live Calls
    const { data: recentCalls } = await supabase.schema('inbound')
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

    const stats = {
      metrics: {
        outreach: { label: 'Outreach Activity', value: totalOutreach, change: '+12% vs last week' },
        meetings: { label: 'Meetings Booked', value: totalMeetings, change: '+5% vs last week' },
        pipeline: { label: 'Pipeline Value', value: pipelineValue, change: '', formatted: `$${pipelineValue.toLocaleString()}`, tooltip: 'Estimated pipeline value' },
        hoursSaved: { label: 'Hours Saved', value: hoursSaved, formatted: `${hoursSaved}h`, tooltip: 'Time saved by AI agents' }
      },
      liveCalls: formattedLiveCalls,
      funnelData: [
        { stage: 'Total Contacts', count: totalOutreach, percentage: 100, color: 'hsl(var(--muted-foreground))' },
        { stage: 'Connected', count: Math.round(totalOutreach * 0.4), percentage: 40, color: 'hsl(var(--accent-blue))' },
        { stage: 'Qualified Leads', count: leads?.length || 0, percentage: Math.round(((leads?.length || 0) / (totalOutreach || 1)) * 100), color: 'hsl(var(--primary))' },
        { stage: 'Meetings Booked', count: totalMeetings, percentage: Math.round((totalMeetings / (totalOutreach || 1)) * 100), color: '#00ff88' }
      ],
      contactsData: leads || [],
      meetings: leads?.filter(l => l.status === 'success') || []
    }

    return res.status(StatusCodes.OK).json({ data: stats })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message }
    })
  }
}
