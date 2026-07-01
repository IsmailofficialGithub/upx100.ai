import * as adminService from '../services/admin.service.js';
import * as userService from '../services/user.service.js';
import * as callLogService from '../services/callLog.service.js';
import { StatusCodes } from 'http-status-codes';
import { supabaseAdmin } from '../config/supabase.js';
import { sanitizePhonesForApi } from '../utils/phoneNumberCompliance.js';
import { enrichCallLogRow } from '../utils/callLogDirection.js';
import { effectiveCallLogOrganizationId } from '../utils/callLogOrg.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GCC data views: optional `?organization_id=<uuid>` narrows stats/lists to one tenant.
 * SP / client behavior unchanged (query ignored unless matrix expands).
 */
export const resolveScopedTargetOrgIds = async (req) => {
  const base = await getTargetOrgIds(req);
  const { role } = req.user;
  const raw = req.query?.organization_id;
  if (raw == null || raw === '' || raw === 'all') return base;
  if (!(role === 'gcc_admin' || role === 'gcc_reviewer')) return base;
  if (!UUID_RE.test(String(raw))) return base;
  return [String(raw)];
};

/**
 * Org scope for admin list APIs (stats, call logs, etc.).
 * Only gcc_admin (and legacy admin) get null = all organizations.
 * gcc_reviewer sees all tenants for review workflows (matrix: cross-tenant read for reviewer).
 * Never returns null for SP without assignments (prevents accidental global data leak).
 */
export const getTargetOrgIds = async (req) => {
  const { role, userId, orgId } = req.user;

  if (role === 'gcc_admin' || role === 'gcc_reviewer' || role === 'admin') {
    return null;
  }

  if (role === 'sp_primary' || role === 'sp_sub') {
    let spId = userId;
    if (role === 'sp_sub') {
      const { data: primary } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', orgId)
        .eq('role', 'sp_primary')
        .single();
      if (primary) spId = primary.id;
    }
    const { data: assignments } = await userService.getSPClientAssignments(spId);
    const assignedIds = assignments?.map((a) => a.client_org_id) || [];

    if (assignedIds.length === 0) {
      if (orgId) return [orgId];
      return [];
    }

    return assignedIds;
  }

  if (!orgId) {
    return [];
  }
  return [orgId];
};

/**
 * Export scope: matrix allows GCC Admin (all) and Client Admin (own org) only.
 */
export const getExportTargetOrgIds = async (req) => {
  const { role, orgId } = req.user;

  if (role === 'gcc_admin' || role === 'admin') {
    return null;
  }

  if (role === 'client_admin') {
    if (!orgId) return [];
    return [orgId];
  }

  return [];
};

export const getStats = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  const stats = await adminService.getGlobalStats(targetOrgIds);
  res.status(StatusCodes.OK).json({ data: stats });
};

export const getUsers = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });
  
  const { data, error } = await adminService.getAllUsers(req.query.search, targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getOrganizations = async (req, res) => {
  try {
    const targetOrgIds = await getTargetOrgIds(req);
    console.log('[AdminController] getOrganizations - targetOrgIds:', targetOrgIds);
    
    if (targetOrgIds && targetOrgIds.length === 0) {
      console.log('[AdminController] getOrganizations - returning empty due to scoping');
      return res.status(StatusCodes.OK).json({ data: [] });
    }

    const { data, error } = await adminService.getAllOrganizations(req.query.search, targetOrgIds);
    if (error) {
      console.error('[AdminController] getOrganizations - error:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
    
    console.log('[AdminController] getOrganizations - success, count:', data?.length);
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    console.error('[AdminController] getOrganizations - exception:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getCallLogs = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllCallLogs(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data: (data || []).map(enrichCallLogRow) });
};

export const deleteCallLogs = async (req, res) => {
  const raw = req.body?.ids;
  const ids = Array.isArray(raw)
    ? [...new Set(raw.map((id) => String(id).trim()).filter((id) => UUID_RE.test(id)))]
    : [];

  if (!ids.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'BAD_REQUEST', message: 'ids must be a non-empty array of call log UUIDs' },
    });
  }

  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'No clients in scope' },
    });
  }

  let logs;
  try {
    logs = await callLogService.getCallLogsByIds(ids);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e.message });
  }

  if (logs.length !== ids.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'One or more call logs were not found' },
    });
  }

  for (const log of logs) {
    const orgId = effectiveCallLogOrganizationId(log);
    if (targetOrgIds?.length && (!orgId || !targetOrgIds.includes(orgId))) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Call log is outside your client scope' },
      });
    }
  }

  try {
    const result = await callLogService.deleteCallLogsByIds(ids);
    return res.status(StatusCodes.OK).json({ data: result });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e.message });
  }
};

export const getLeads = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllLeads(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getPhoneNumbers = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllPhoneNumbers(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data: sanitizePhonesForApi(data) });
};

export const getAgents = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllAgents(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  const safe = (data || []).map(({ vapi_id: _v, model: _m, ...row }) => row);
  res.status(StatusCodes.OK).json({ data: safe });
};

export const getScriptRequests = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllScriptRequests(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getTargetUploads = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllTargetUploads(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getVoiceClones = async (req, res) => {
  const targetOrgIds = await resolveScopedTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllVoiceClones(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

// --- User CRUD ---

export const createUser = async (req, res) => {
  const { data, error } = await adminService.createUser(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.CREATED).json({ data });
};

export const updateUser = async (req, res) => {
  const { data, error } = await adminService.updateUser(req.params.id, req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { error } = await adminService.deleteUser(id);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.OK).json({ message: 'User deleted' });
};

// --- Org CRUD ---

export const createOrganization = async (req, res) => {
  const { data, error } = await adminService.createOrganization(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.CREATED).json({ data });
};

export const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await adminService.updateOrganization(id, req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const deleteOrganization = async (req, res) => {
  const { id } = req.params;
  const { error } = await adminService.deleteOrganization(id);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error });
  res.status(StatusCodes.OK).json({ message: 'Organization deleted' });
};

export const updateOrganizationSubscription = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { packageId, status, currentPeriodEnd } = req.body;

    if (!packageId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'BAD_REQUEST', message: 'packageId is required' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        organization_id: orgId,
        package_id: packageId,
        status: status || 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd).toISOString() : null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'organization_id' })
      .select()
      .single();

    if (error) throw error;

    // Clear caches in Redis
    try {
      const { clearOrgCache } = await import('../redis/billingCache.js');
      await clearOrgCache(orgId);
    } catch (cacheErr) {
      console.error('[AdminController] Failed to clear Redis cache for subscription update:', cacheErr);
    }

    return res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err);
  }
};

export const getSubscriptions = async (req, res) => {
  const { data, error } = await adminService.getAllSubscriptions(req.query.search);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const updateSubscriptionPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount_cents, max_inbound_phone_numbers, max_agents, allow_voice_cloning, max_lead_upload_rows } = req.body;

    const updates = {};
    if (amount_cents !== undefined) updates.amount_cents = Number(amount_cents);
    if (max_inbound_phone_numbers !== undefined) updates.max_inbound_phone_numbers = Number(max_inbound_phone_numbers);
    if (max_agents !== undefined) updates.max_agents = Number(max_agents);
    if (allow_voice_cloning !== undefined) updates.allow_voice_cloning = Boolean(allow_voice_cloning);
    if (max_lead_upload_rows !== undefined) updates.max_lead_upload_rows = Number(max_lead_upload_rows);
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('subscription_packages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Clear packages cache in Redis
    try {
      const redis = (await import('../config/redis.js')).default;
      if (redis.status === 'ready') {
        await redis.del('billing:packages');
        console.log('[REDIS ACTION] Invalidated billing:packages cache');
      }
    } catch (cacheErr) {
      console.error('[AdminController] Failed to clear Redis packages cache:', cacheErr);
    }

    return res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err);
  }
};

export const createSubscriptionPackage = async (req, res, next) => {
  try {
    const { name, description, amount_cents, max_inbound_phone_numbers, max_agents, allow_voice_cloning, max_lead_upload_rows } = req.body;

    if (!name || amount_cents === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'BAD_REQUEST', message: 'name and amount_cents are required' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('subscription_packages')
      .insert([{
        name,
        description: description || '',
        amount_cents: Number(amount_cents),
        interval: 'month',
        currency: 'usd',
        max_inbound_phone_numbers: max_inbound_phone_numbers !== undefined ? Number(max_inbound_phone_numbers) : 1,
        max_agents: max_agents !== undefined ? Number(max_agents) : 1,
        allow_voice_cloning: allow_voice_cloning !== undefined ? Boolean(allow_voice_cloning) : false,
        max_lead_upload_rows: max_lead_upload_rows !== undefined ? Number(max_lead_upload_rows) : 100
      }])
      .select()
      .single();

    if (error) throw error;

    // Clear packages cache in Redis
    try {
      const redis = (await import('../config/redis.js')).default;
      if (redis.status === 'ready') {
        await redis.del('billing:packages');
        console.log('[REDIS ACTION] Invalidated billing:packages cache');
      }
    } catch (cacheErr) {
      console.error('[AdminController] Failed to clear Redis packages cache:', cacheErr);
    }

    return res.status(StatusCodes.CREATED).json({ data });
  } catch (err) {
    next(err);
  }
};

export const deleteSubscriptionPackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('subscription_packages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clear packages cache in Redis
    try {
      const redis = (await import('../config/redis.js')).default;
      if (redis.status === 'ready') {
        await redis.del('billing:packages');
        console.log('[REDIS ACTION] Invalidated billing:packages cache');
      }
    } catch (cacheErr) {
      console.error('[AdminController] Failed to clear Redis packages cache:', cacheErr);
    }

    return res.status(StatusCodes.OK).json({ message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
};

