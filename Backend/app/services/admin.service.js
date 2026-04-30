import { supabaseAdmin } from '../config/supabase.js';

/**
 * Admin Service - Global access to all data
 */

export const getGlobalStats = async () => {
  // Aggregate stats across all organizations
  const { count: totalOrgs } = await supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true });
  const { count: totalUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalCalls } = await supabaseAdmin.schema('inbound').from('call_logs').select('*', { count: 'exact', head: true });
  const { count: totalLeads } = await supabaseAdmin.schema('inbound').from('leads').select('*', { count: 'exact', head: true });
  const { count: totalAgents } = await supabaseAdmin.schema('inbound').from('agents').select('*', { count: 'exact', head: true });

  // Get status breakdown for calls
  const { data: callStatusBreakdown } = await supabaseAdmin.rpc('get_call_status_breakdown'); 
  // Note: if RPC doesn't exist, we'd do a grouped query. 
  // Let's assume we do a raw query for now or just return the counts.

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

export const getAllUsers = async () => {
  return await supabaseAdmin
    .from('profiles')
    .select('*, organizations!profiles_organization_id_fkey(name, country_code)')

    .order('created_at', { ascending: false });
};

export const getAllOrganizations = async () => {
  return await supabaseAdmin
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getAllCallLogs = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('*, organizations!call_logs_organization_id_fkey(name), agents(name)')
    .order('created_at', { ascending: false });
};

export const getAllLeads = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*, organizations!leads_organization_id_fkey(name), agents(name)')
    .order('created_at', { ascending: false });
};

export const getAllPhoneNumbers = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*, organizations!phone_numbers_organization_id_fkey(name), agents(name)')
    .order('created_at', { ascending: false });
};

export const getAllAgents = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations!agents_organization_id_fkey(name)')
    .order('created_at', { ascending: false });
};

export const getAllScriptRequests = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*, organizations!script_change_requests_organization_id_fkey(name)')
    .order('submitted_at', { ascending: false });
};

export const getAllTargetUploads = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*, organizations!target_account_uploads_organization_id_fkey(name)')
    .order('uploaded_at', { ascending: false });
};

export const getAllVoiceClones = async () => {
  return await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*, organizations!voice_clone_submissions_organization_id_fkey(name)')
    .order('submitted_at', { ascending: false });
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
      role,
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

