import express from 'express';
import { auth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js';
import * as exportController from '../controllers/export.controller.js';

const router = express.Router();

router.use(auth);
router.get('/monthly', requireRole(['gcc_admin', 'client_admin']), exportController.getMonthlyExport);

export default router;
