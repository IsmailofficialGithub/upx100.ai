import express from 'express';
import { auth } from '../middlewares/auth.js';
import * as exportController from '../controllers/export.controller.js';

const router = express.Router();

router.use(auth);
router.get('/monthly', exportController.getMonthlyExport);

export default router;
