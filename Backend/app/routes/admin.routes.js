import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router();

const elevatedRoles = ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub'];

// All admin routes require authentication and GCC/SP role
router.use(auth, isAdmin);

router.get('/stats', requireRole(elevatedRoles), adminController.getStats);

// Users
router.get('/users', requireRole(elevatedRoles), adminController.getUsers);
router.post('/users', requireRole(elevatedRoles), adminController.createUser);
router.patch('/users/:id', requireRole(elevatedRoles), adminController.updateUser);
router.delete('/users/:id', requireRole(elevatedRoles), adminController.deleteUser);

// Organizations
router.get('/organizations', requireRole(elevatedRoles), adminController.getOrganizations);
router.post('/organizations', requireRole(elevatedRoles), adminController.createOrganization);
router.patch('/organizations/:id', requireRole(elevatedRoles), adminController.updateOrganization);
router.delete('/organizations/:id', requireRole(elevatedRoles), adminController.deleteOrganization);

router.get('/call-logs', requireRole(elevatedRoles), adminController.getCallLogs);
router.get('/leads', requireRole(elevatedRoles), adminController.getLeads);
router.get('/phone-numbers', requireRole(elevatedRoles), adminController.getPhoneNumbers);
router.get('/agents', requireRole(elevatedRoles), adminController.getAgents);
router.get('/script-requests', requireRole(elevatedRoles), adminController.getScriptRequests);
router.get('/target-uploads', requireRole(elevatedRoles), adminController.getTargetUploads);
router.get('/voice-clones', requireRole(elevatedRoles), adminController.getVoiceClones);


export default router;
