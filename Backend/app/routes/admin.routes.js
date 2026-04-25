import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { auth, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All admin routes require authentication and GCC role
router.use(auth, isAdmin);

router.get('/stats', adminController.getStats);

// Users
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Organizations
router.get('/organizations', adminController.getOrganizations);
router.post('/organizations', adminController.createOrganization);
router.patch('/organizations/:id', adminController.updateOrganization);
router.delete('/organizations/:id', adminController.deleteOrganization);

router.get('/call-logs', adminController.getCallLogs);
router.get('/leads', adminController.getLeads);
router.get('/phone-numbers', adminController.getPhoneNumbers);


export default router;
