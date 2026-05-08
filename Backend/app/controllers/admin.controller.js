import * as adminService from '../services/admin.service.js';
import * as userService from '../services/user.service.js';
import { StatusCodes } from 'http-status-codes';
import { supabaseAdmin } from '../config/supabase.js';

export const getTargetOrgIds = async (req) => {
  const { role, userId, orgId } = req.user;
  console.log('[AdminController] getTargetOrgIds - User:', userId, 'Role:', role, 'Org:', orgId);
  
  if (role === 'gcc_admin' || role === 'gcc_reviewer' || role === 'admin') {
    console.log('[AdminController] All-access granted');
    return null; // All access
  }
  
  if (role === 'sp_primary' || role === 'sp_sub') {
    let spId = userId;
    if (role === 'sp_sub') {
      // Import supabaseAdmin if not present or use a service method
      const { data: primary } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', orgId)
        .eq('role', 'sp_primary')
        .single();
      if (primary) spId = primary.id;
    }
    const { data: assignments } = await userService.getSPClientAssignments(spId);
    const assignedIds = assignments?.map(a => a.client_org_id) || [];
    
    // Fallback to own org if no assignments, or null for all-access if no orgId
    if (assignedIds.length === 0) {
      if (orgId) {
        console.log('[AdminController] No SP assignments found, falling back to own orgId:', orgId);
        return [orgId];
      }
      console.log('[AdminController] SP has no assignments and no orgId, granting all-access for discovery');
      return null; 
    }
    
    return assignedIds;
  }

  // Clients
  if (!orgId) {
    if (role.startsWith('gcc_') || role.startsWith('sp_') || role === 'admin') {
      console.log('[AdminController] Admin-level user with no orgId, granting all-access');
      return null;
    }
    console.warn('[AdminController] User has no orgId and is not a global admin');
    return [];
  }
  return [orgId];
};

export const getStats = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  const stats = await adminService.getGlobalStats(targetOrgIds);
  res.status(StatusCodes.OK).json({ data: stats });
};

export const getUsers = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
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
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllCallLogs(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getLeads = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllLeads(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getPhoneNumbers = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllPhoneNumbers(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getAgents = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllAgents(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getScriptRequests = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllScriptRequests(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getTargetUploads = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
  if (targetOrgIds && targetOrgIds.length === 0) return res.status(StatusCodes.OK).json({ data: [] });

  const { data, error } = await adminService.getAllTargetUploads(targetOrgIds);
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getVoiceClones = async (req, res) => {
  const targetOrgIds = await getTargetOrgIds(req);
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

