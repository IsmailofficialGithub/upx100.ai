import * as adminService from '../services/admin.service.js';
import { StatusCodes } from 'http-status-codes';

export const getStats = async (req, res) => {
  const stats = await adminService.getGlobalStats();
  res.status(StatusCodes.OK).json({ data: stats });
};

export const getUsers = async (req, res) => {
  const { data, error } = await adminService.getAllUsers();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getOrganizations = async (req, res) => {
  const { data, error } = await adminService.getAllOrganizations();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getCallLogs = async (req, res) => {
  const { data, error } = await adminService.getAllCallLogs();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getLeads = async (req, res) => {
  const { data, error } = await adminService.getAllLeads();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getPhoneNumbers = async (req, res) => {
  const { data, error } = await adminService.getAllPhoneNumbers();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getAgents = async (req, res) => {
  const { data, error } = await adminService.getAllAgents();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getScriptRequests = async (req, res) => {
  const { data, error } = await adminService.getAllScriptRequests();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getTargetUploads = async (req, res) => {
  const { data, error } = await adminService.getAllTargetUploads();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

export const getVoiceClones = async (req, res) => {
  const { data, error } = await adminService.getAllVoiceClones();
  if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  res.status(StatusCodes.OK).json({ data });
};

// --- User CRUD ---

export const createUser = async (req, res) => {
  console.log('[AdminController] Attempting to create user:', req.body.email);
  const { data, error } = await adminService.createUser(req.body);
  if (error) {
    console.error('[AdminController] User creation failed:', error);
    return res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
  console.log('[AdminController] User created successfully:', data.user.id);
  res.status(StatusCodes.CREATED).json({ data });
};

export const updateUser = async (req, res) => {
  console.log('[AdminController] Attempting to update user:', req.params.id);
  const { data, error } = await adminService.updateUser(req.params.id, req.body);
  if (error) {
    console.error('[AdminController] User update failed:', error);
    return res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
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

