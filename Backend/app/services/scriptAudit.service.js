import { supabaseAdmin } from '../config/supabase.js';

export const listAgentsForOrg = async (organizationId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('id, name, script, status, agent_type, updated_at')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateAgentScriptDirect = async ({
  organizationId,
  agentId,
  script,
  actorId,
  campaignType,
}) => {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('id, organization_id, script')
    .eq('id', agentId)
    .is('deleted_at', null)
    .single();

  if (fetchError || !existing) {
    const err = new Error('Agent not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  if (existing.organization_id !== organizationId) {
    const err = new Error('Agent does not belong to this organization');
    err.code = 'FORBIDDEN';
    throw err;
  }

  const previousScript = existing.script ?? '';
  const newScript = String(script ?? '');

  const { data: updated, error: updateError } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .update({
      script: newScript,
      updated_at: new Date().toISOString(),
    })
    .eq('id', agentId)
    .select('id, name, script, status, updated_at')
    .single();

  if (updateError) throw updateError;

  const { data: auditRow, error: auditError } = await supabaseAdmin
    .schema('inbound')
    .from('script_audit_log')
    .insert({
      organization_id: organizationId,
      agent_id: agentId,
      actor_id: actorId,
      action: 'script_updated',
      campaign_type: campaignType || null,
      previous_script: previousScript,
      new_script: newScript,
    })
    .select('id, organization_id, agent_id, actor_id, action, campaign_type, created_at')
    .single();

  if (auditError) throw auditError;

  return { agent: updated, audit: auditRow };
};

export const listScriptAuditLog = async (organizationId, limit = 50) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_audit_log')
    .select('id, organization_id, agent_id, actor_id, action, campaign_type, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!data?.length) return [];

  const agentIds = [...new Set(data.map((r) => r.agent_id).filter(Boolean))];
  const actorIds = [...new Set(data.map((r) => r.actor_id).filter(Boolean))];

  const agentById = {};
  if (agentIds.length) {
    const { data: agents } = await supabaseAdmin
      .schema('inbound')
      .from('agents')
      .select('id, name')
      .in('id', agentIds);
    (agents || []).forEach((a) => {
      agentById[a.id] = a.name;
    });
  }

  const actorById = {};
  if (actorIds.length) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email')
      .in('id', actorIds);
    (profiles || []).forEach((p) => {
      actorById[p.id] = p.full_name || p.email || p.id;
    });
  }

  return data.map((row) => ({
    ...row,
    agent_name: agentById[row.agent_id] || null,
    actor_name: actorById[row.actor_id] || null,
  }));
};
