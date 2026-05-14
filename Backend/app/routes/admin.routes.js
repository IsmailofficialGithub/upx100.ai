import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router();

const readElevated = ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub'];

// All admin routes require authentication and GCC/SP role
router.use(auth)
router.use(isAdmin);

router.get('/stats', requireRole(readElevated), adminController.getStats);
router.get('/debug/scoping', requireRole(readElevated), async (req, res) => {
  const targetOrgIds = await adminController.getTargetOrgIds(req);
  res.json({ 
    user: {
      id: req.user.userId,
      role: req.user.role,
      orgId: req.user.orgId
    },
    targetOrgIds 
  });
});

// Users — mutations: GCC Admin only (matrix: create partners/clients; manage billing)
router.get('/users', requireRole(readElevated), adminController.getUsers);
router.post('/users', requireRole(['gcc_admin']), adminController.createUser);
router.patch('/users/:id', requireRole(['gcc_admin']), adminController.updateUser);
router.delete('/users/:id', requireRole(['gcc_admin']), adminController.deleteUser);

// Organizations — mutations: GCC Admin only
router.get('/organizations', requireRole(readElevated), adminController.getOrganizations);
router.post('/organizations', requireRole(['gcc_admin']), adminController.createOrganization);
router.patch('/organizations/:id', requireRole(['gcc_admin']), adminController.updateOrganization);
router.delete('/organizations/:id', requireRole(['gcc_admin']), adminController.deleteOrganization);

router.get('/call-logs', requireRole(readElevated), adminController.getCallLogs);
router.get('/leads', requireRole(readElevated), adminController.getLeads);
router.get('/phone-numbers', requireRole(readElevated), adminController.getPhoneNumbers);
router.get('/agents', requireRole(readElevated), adminController.getAgents);
router.get('/script-requests', requireRole(readElevated), adminController.getScriptRequests);
router.get('/target-uploads', requireRole(readElevated), adminController.getTargetUploads);
router.get('/voice-clones', requireRole(readElevated), adminController.getVoiceClones);


export default router;
