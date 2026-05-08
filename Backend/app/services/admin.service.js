import { supabaseAdmin } from '../config/supabase.js';

/**
 * Admin Service - Global access to all data
 */

export const getGlobalStats = async (targetOrgIds = null) => {
  // Aggregate stats across all organizations (or scoped ones)
  let orgQuery = supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true });
  let userQuery = supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  let callQuery = supabaseAdmin.schema('inbound').from('call_logs').select('*', { count: 'exact', head: true });
  let leadQuery = supabaseAdmin.schema('inbound').from('leads').select('*', { count: 'exact', head: true });
  let agentQuery = supabaseAdmin.schema('inbound').from('agents').select('*', { count: 'exact', head: true });

  if (targetOrgIds) {
    orgQuery = orgQuery.in('id', targetOrgIds);
    userQuery = userQuery.in('organization_id', targetOrgIds);
    callQuery = callQuery.in('organization_id', targetOrgIds);
    leadQuery = leadQuery.in('organization_id', targetOrgIds);
    agentQuery = agentQuery.in('organization_id', targetOrgIds);
  }

  const { count: totalOrgs } = await orgQuery;
  const { count: totalUsers } = await userQuery;
  const { count: totalCalls } = await callQuery;
  const { count: totalLeads } = await leadQuery;
  const { count: totalAgents } = await agentQuery;

  // Get status breakdown for calls
  const { data: callStatusBreakdown } = await supabaseAdmin.rpc('get_call_status_breakdown'); 

  const { count: pendingScripts } = await supabaseAdmin.schema('inbound').from('script_change_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: pendingUploads } = await supabaseAdmin.schema('inbound').from('target_account_uploads').select('*', { count: 'exact', head: true }).eq('status', 'pending_review');
  const { count: pendingClones } = await supabaseAdmin.schema('inbound').from('voice_clone_submissions').select('*', { count: 'exact', head: true }).eq('status', 'submitted');

  return {
    organizations: totalOrgs || 0,
    users: totalUsers || 0,
    calls: totalCalls || 0,
    leads: totalLeads || 0,
    agents: totalAgents || 0,
    pendingScripts: pendingScripts || 0,
    pendingUploads: pendingUploads || 0,
    pendingClones: pendingClones || 0
  };
};

export const getAllUsers = async (searchTerm = '', targetOrgIds = null) => {
  let query = supabaseAdmin
    .from('profiles')
    .select('*, organizations!profiles_organization_id_fkey(name, country_code)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
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
  let query = supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('*, organizations!call_logs_organization_id_fkey(name), agents(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

export const getAllLeads = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*, organizations!leads_organization_id_fkey(name), agents(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
};

export const getAllPhoneNumbers = async (targetOrgIds = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*, organizations!phone_numbers_organization_id_fkey(name), agents(name)')
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
    .select('*, organizations!script_change_requests_organization_id_fkey(name)')
    .order('created_at', { ascending: false });

  if (targetOrgIds) {
    query = query.in('organization_id', targetOrgIds);
  }

  return await query;
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

