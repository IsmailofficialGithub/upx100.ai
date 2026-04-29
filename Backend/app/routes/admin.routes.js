import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router();

// All admin routes require authentication and GCC role
router.use(auth, isAdmin);

router.get('/stats', adminController.getStats);

// Users
router.get('/users', requireRole(['gcc_admin']), adminController.getUsers);
router.post('/users', requireRole(['gcc_admin']), adminController.createUser);
router.patch('/users/:id', requireRole(['gcc_admin']), adminController.updateUser);
router.delete('/users/:id', requireRole(['gcc_admin']), adminController.deleteUser);

// Organizations
router.get('/organizations', adminController.getOrganizations);
router.post('/organizations', requireRole(['gcc_admin']), adminController.createOrganization);
router.patch('/organizations/:id', requireRole(['gcc_admin']), adminController.updateOrganization);
router.delete('/organizations/:id', requireRole(['gcc_admin']), adminController.deleteOrganization);

router.get('/call-logs', adminController.getCallLogs);
router.get('/leads', adminController.getLeads);
router.get('/phone-numbers', adminController.getPhoneNumbers);


export default router;
