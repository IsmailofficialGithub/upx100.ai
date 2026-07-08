import { supabaseAdmin } from '../config/supabase.js';
import { mergeCallLogDirections } from './callLog.service.js';
import { enrichScriptRequestRows } from './scriptRequest.service.js';

/**
 * Admin Service - Global access to all data
 */

function startOfCurrentMonthIso() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function scopeInbound(query, targetOrgIds) {
  if (targetOrgIds?.length) {
    return query.in('organization_id', targetOrgIds);
  }
  return query;
}

/**
 * inbound.call_logs / leads have organization_id but no FK to public.organizations (see 04_call_logs_and_leads.sql).
 * PostgREST embed organizations!*_fkey returns PGRST200 — resolve names in application code.
 */
async function fetchOrganizationNameMap(orgIds) {
  const ids = [...new Set((orgIds || []).filter(Boolean))];
  const map = {};
  if (!ids.length) return map;
  const { data, error } = await supabaseAdmin.from('organizations').select('id, name').in('id', ids);
  if (error) throw error;
  (data || []).forEach((o) => {
    map[o.id] = o.name;
  });
  return map;
}

function attachOrganizationNames(rows, orgNameById) {
  return (rows || []).map((row) => {
    const name = row.organization_id ? orgNameById[row.organization_id] ?? null : null;
    return {
      ...row,
      organization_name: row.organization_name ?? name,
      organizations: name != null ? { name } : row.organizations ?? null,
    };
  });
}

function healthStatusFromScore(health) {
  if (health >= 90) return 'Healthy';
  if (health >= 80) return 'Stable';
  if (health >= 70) return 'Needs Review';
  return 'At Risk';
}

function mrrHealthBonus(mrrValue) {
  const mrr = Number(mrrValue) || 0;
  if (mrr <= 0) return 0;
  if (mrr >= 15000) return 14;
  if (mrr >= 5000) return 10;
  if (mrr >= 1000) return 6;
  return 3;
}

function computeHealthScore({ liveCalls, meetings, totalCalls, pendingReview, mrrValue }) {
  let health = 68;
  if (totalCalls > 0) health += 12;
  if (liveCalls > 0) health += 6;
  health += Math.min(14, meetings * 3);
  health += mrrHealthBonus(mrrValue);
  health -= Math.min(24, pendingReview * 8);
  return Math.max(50, Math.min(100, Math.round(health)));
}

/**
 * Per-tenant portfolio row for GCC Command Center (live calls, meetings, MRR, health).
 */
export const getClientHealthOverview = async (targetOrgIds = null) => {
  let orgQuery = supabaseAdmin.from('organizations').select('id, name, country_code').order('name');
  if (targetOrgIds?.length) {
    orgQuery = orgQuery.in('id', targetOrgIds);
  }

  const { data: orgs, error: orgError } = await orgQuery;
  if (orgError) throw orgError;
  if (!orgs?.length) return [];

  const orgIds = orgs.map((o) => o.id);
  const monthStartIso = startOfCurrentMonthIso();

  const { data: callLogs } = await scopeInbound(
    supabaseAdmin.schema('inbound').from('call_logs').select('organization_id, status, created_at'),
    orgIds,
  );

  const { data: monthLeads } = await scopeInbound(
    supabaseAdmin
      .schema('inbound')
      .from('leads')
      .select('organization_id, status, created_at, meeting_time')
      .gte('created_at', monthStartIso),
    orgIds,
  );

  let scriptPendingQuery = supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('organization_id')
    .eq('status', 'pending');
  let uploadPendingQuery = supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('organization_id')
    .eq('status', 'pending_review');
  if (targetOrgIds?.length) {
    scriptPendingQuery = scriptPendingQuery.in('organization_id', orgIds);
    uploadPendingQuery = uploadPendingQuery.in('organization_id', orgIds);
  }
  const [{ data: pendingScripts }, { data: pendingUploads }] = await Promise.all([
    scriptPendingQuery,
    uploadPendingQuery,
  ]);

  const { data: commissions } = await supabaseAdmin
    .from('commissions')
    .select('organization_id, collected_mrr, created_at')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false });

  const mrrByOrg = {};
  for (const row of commissions || []) {
    if (row.organization_id && mrrByOrg[row.organization_id] == null) {
      mrrByOrg[row.organization_id] = Number(row.collected_mrr) || 0;
    }
  }

  return orgs.map((org) => {
    const orgCalls = (callLogs || []).filter((c) => c.organization_id === org.id);
    const liveCalls = orgCalls.filter((c) => c.status === 'in_progress').length;
    const meetings = (monthLeads || []).filter(
      (l) => l.organization_id === org.id && l.status === 'success',
    ).length;
    const pendingReview =
      (pendingScripts || []).filter((p) => p.organization_id === org.id).length +
      (pendingUploads || []).filter((p) => p.organization_id === org.id).length;

    const mrrValue = mrrByOrg[org.id] ?? 0;

    const health = computeHealthScore({
      liveCalls,
      meetings,
      totalCalls: orgCalls.length,
      pendingReview,
      mrrValue,
    });

    return {
      organizationId: org.id,
      client: org.name,
      country_code: org.country_code,
      liveCalls,
      meetings,
      mrrValue,
      health,
      status: healthStatusFromScore(health),
    };
  });
};

export const getGlobalStats = async (targetOrgIds = null) => {
  const monthStartIso = startOfCurrentMonthIso();

  let orgQuery = supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true });
  let userQuery = supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  let callQuery = supabaseAdmin.schema('inbound').from('call_logs').select('*', { count: 'exact', head: true });
  let activeCallQuery = supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');
  let leadQuery = supabaseAdmin.schema('inbound').from('leads').select('*', { count: 'exact', head: true });
  let meetingsQuery = supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'success')
    .gte('created_at', monthStartIso);
  let agentQuery = supabaseAdmin.schema('inbound').from('agents').select('*', { count: 'exact', head: true });

  if (targetOrgIds?.length) {
    orgQuery = orgQuery.in('id', targetOrgIds);
    userQuery = userQuery.in('organization_id', targetOrgIds);
    callQuery = callQuery.in('organization_id', targetOrgIds);
    activeCallQuery = activeCallQuery.in('organization_id', targetOrgIds);
    leadQuery = leadQuery.in('organization_id', targetOrgIds);
    meetingsQuery = meetingsQuery.in('organization_id', targetOrgIds);
    agentQuery = agentQuery.in('organization_id', targetOrgIds);
  }

  const [
    { count: totalOrgs },
    { count: totalUsers },
    { count: totalCalls },
    { count: activeCalls },
    { count: totalLeads },
    { count: meetingsThisMonth },
    { count: totalAgents },
  ] = await Promise.all([
    orgQuery,
    userQuery,
    callQuery,
    activeCallQuery,
    leadQuery,
    meetingsQuery,
    agentQuery,
  ]);

  let pendingScriptsQuery = supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  let pendingUploadsQuery = supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review');
  let pendingClonesQuery = supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'submitted');

  if (targetOrgIds?.length) {
    pendingScriptsQuery = pendingScriptsQuery.in('organization_id', targetOrgIds);
    pendingUploadsQuery = pendingUploadsQuery.in('organization_id', targetOrgIds);
    pendingClonesQuery = pendingClonesQuery.in('organization_id', targetOrgIds);
  }

  const [{ count: pendingScripts }, { count: pendingUploads }, { count: pendingClones }, clientHealth] =
    await Promise.all([
      pendingScriptsQuery,
      pendingUploadsQuery,
      pendingClonesQuery,
      getClientHealthOverview(targetOrgIds),
    ]);

  const mrr = clientHealth.reduce((sum, row) => sum + (row.mrrValue || 0), 0);

  return {
    organizations: totalOrgs || 0,
    users: totalUsers || 0,
    calls: totalCalls || 0,
    leads: totalLeads || 0,
    agents: totalAgents || 0,
    activeCalls: activeCalls || 0,
    meetingsThisMonth: meetingsThisMonth || 0,
    mrr,
    pendingScripts: pendingScripts || 0,
    pendingUploads: pendingUploads || 0,
    pendingClones: pendingClones || 0,
    clientHealth,
  };
};

export const getAllUsers = async (searchTerm = '', targetOrgIds = null) => {
  let query = supabaseAdmin
    .from('profiles')
    .select('*, organizations!profiles_organization_id_fkey(name, country_code)')
    .order('created_at', { ascending: false });

  if (targetOrgIds?.length) {
    const orgIds = targetOrgIds.filter(Boolean);
    const [{ data: assignments }, { data: deals }] = await Promise.all([
      supabaseAdmin.from('sp_client_assignments').select('sp_user_id').in('client_org_id', orgIds),
      supabaseAdmin.from('sp_sub_deals').select('sp_sub_user_id').in('client_org_id', orgIds),
    ]);

    const linkedPartnerIds = [
      ...new Set([
        ...(assignments || []).map((a) => a.sp_user_id),
        ...(deals || []).map((d) => d.sp_sub_user_id),
      ]),
    ].filter(Boolean);

    const parts = [`organization_id.in.(${orgIds.join(',')})`];
    if (linkedPartnerIds.length) {
      parts.push(`id.in.(${linkedPartnerIds.join(',')})`);
    }
    query = query.or(parts.join(','));
  }

  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    const term = searchTerm.trim();
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  return await query;
};

export const getAllOrganizations = async (searchTerm = '', targetOrgIds = null) => {
  let query = supabaseAdmin
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('id', targetOrgIds);
  }

  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    const term = searchTerm.trim();
    query = query.ilike('name', `%${term}%`);
  }

  let result = await query;
  console.log('[AdminService] getAllOrganizations - Query result count:', result.data?.length, 'Error:', result.error);

  // Fallback to Inbound_Organizations if standard organizations is empty or fails
  if (((!result.data || result.data.length === 0) || result.error) && !targetOrgIds) {
    console.log('[AdminService] organizations table empty, trying Inbound_Organizations...');
    let fallbackQuery = supabaseAdmin
      .from('Inbound_Organizations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
      fallbackQuery = fallbackQuery.ilike('name', `%${term}%`);
    }
    
    const fallbackResult = await fallbackQuery;
    if (!fallbackResult.error && fallbackResult.data?.length > 0) {
      return fallbackResult;
    }
  }

  return result;
};

export const getAllCallLogs = async (targetOrgIds = null) => {
  let viewQuery = supabaseAdmin
    .from('view_call_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (targetOrgIds?.length) {
    viewQuery = viewQuery.in('organization_id', targetOrgIds);
  }

  const viewResult = await viewQuery;
  if (!viewResult.error) {
    const data = await mergeCallLogDirections(viewResult.data);
    return { data, error: null };
  }

  let query = supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('*, agents(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds?.length) {
    query = query.in('organization_id', targetOrgIds);
  }

  const { data, error } = await query;
  if (error) return { data, error };

  const rows = (data || []).map((row) => ({
    ...row,
    agent_name: row.agent_name ?? row.agents?.name ?? null,
  }));

  try {
    const orgNameById = await fetchOrganizationNameMap(rows.map((r) => r.organization_id));
    return { data: attachOrganizationNames(rows, orgNameById), error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getAllLeads = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*, agents(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds?.length) {
    query = query.in('organization_id', targetOrgIds);
  }

  const { data, error } = await query;
  if (error) return { data, error };

  try {
    const orgNameById = await fetchOrganizationNameMap((data || []).map((r) => r.organization_id));
    const rows = (data || []).map((row) => ({
      ...row,
      organizations: row.organization_id
        ? { name: orgNameById[row.organization_id] ?? null }
        : null,
    }));
    return { data: rows, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getAllPhoneNumbers = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*, organizations!phone_numbers_organization_id_fkey(name), inbound_agent:agents!phone_numbers_inbound_agent_id_fkey(name), outbound_agent:agents!phone_numbers_outbound_agent_id_fkey(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

export const getAllAgents = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations!agents_organization_id_fkey(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

export const getAllScriptRequests = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  const { data, error } = await query;
  if (error) return { data, error };
  try {
    const enriched = await enrichScriptRequestRows(data || []);
    return { data: enriched, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

export const getAllTargetUploads = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*, organizations!target_account_uploads_organization_id_fkey(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

export const getAllVoiceClones = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*, organizations!voice_clone_submissions_organization_id_fkey(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

// --- CRUD OPERATIONS ---

export const createUser = async (userData) => {
  let { email, password, full_name, role, organization_id } = userData;
  console.log('[AdminService] Creating user:', email, 'with role:', role);
  
  // Sanitize organization_id (empty string -> null)
  if (!organization_id || (typeof organization_id === 'string' && organization_id.trim() === '')) {
    organization_id = null;
  }

  // 1. Create User in Supabase Auth
  console.log('[AdminService] Step 1: Creating Auth user...');
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  });

  if (authError) {
    console.error('[AdminService] Auth creation error:', authError);
    return { error: authError };
  }

  console.log('[AdminService] Auth user created:', authUser.user.id);

  // 2. Create Profile
  console.log('[AdminService] Step 2: Creating Profile record...');
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([{
      id: authUser.user.id,
      email,
      full_name,
      role: role || 'client_sub',
      organization_id
    }])
    .select('*, organizations!profiles_organization_id_fkey(name)')
    .single();

  if (profileError) {
    console.error('[AdminService] Profile creation failed:', profileError);
    // Cleanup auth user if profile fails
    console.log('[AdminService] Cleaning up Auth user...');
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { error: profileError };
  }

  console.log('[AdminService] Profile created successfully');
  return { data: { user: authUser.user, profile } };
};

export const updateUser = async (id, updates) => {
  let { role, organization_id, is_active, full_name, password } = updates;
  
  // Sanitize organization_id (empty string -> null)
  if (organization_id === '') {
    organization_id = null;
  }

  // 1. Update Auth User if password is provided
  if (password && password.trim() !== '') {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: password
    });
    if (authError) return { error: authError };
  }

  // 2. Update Profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role, organization_id, is_active, full_name })
    .eq('id', id)
    .select('*, organizations!profiles_organization_id_fkey(name)')
    .single();

  if (profileError) return { error: profileError };
  return { data: profile };
};



export const deleteUser = async (id) => {
  // Delete from Auth first (cascade will handle profiles if configured, but let's be explicit)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authError) return { error: authError };
  
  return await supabaseAdmin.from('profiles').delete().eq('id', id);
};

export const createOrganization = async (orgData) => {
  return await supabaseAdmin
    .from('organizations')
    .insert([orgData])
    .select()
    .single();
};

export const updateOrganization = async (id, updates) => {
  return await supabaseAdmin
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
};

export const deleteOrganization = async (id) => {
  return await supabaseAdmin.from('organizations').delete().eq('id', id);
};

export const getAllSubscriptions = async (searchTerm = '') => {
  let orgsQuery = supabaseAdmin
    .from('organizations')
    .select('id, name, country_code, created_at')
    .order('created_at', { ascending: false });

  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    orgsQuery = orgsQuery.ilike('name', `%${searchTerm.trim()}%`);
  }

  const { data: orgs, error: orgError } = await orgsQuery;
  if (orgError) return { data: null, error: orgError };

  if (!orgs || orgs.length === 0) {
    return { data: [], error: null };
  }

  const orgIds = orgs.map(o => o.id);

  const { data: subs, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('*, subscription_packages(name, amount_cents, interval)')
    .in('organization_id', orgIds);

  if (subError) return { data: null, error: subError };

  const subMap = {};
  (subs || []).forEach(sub => {
    subMap[sub.organization_id] = sub;
  });

  const result = orgs.map(org => ({
    id: org.id,
    name: org.name,
    country_code: org.country_code,
    created_at: org.created_at,
    subscription: subMap[org.id] || null
  }));

  return { data: result, error: null };
};

