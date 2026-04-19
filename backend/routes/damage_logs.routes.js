import express from 'express';
const router = express.Router();
import * as dlController from '../controllers/damage_logs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

// Q38 — Get damage logs with shipment + reporter JOINs
router.get('/',  authenticate, authorize(['admin', 'staff']), dlController.getDamageLogs);

// POST — log a new damage report from UI form
router.post('/', authenticate, authorize(['admin', 'staff']), dlController.createDamageLog);

export default router;
