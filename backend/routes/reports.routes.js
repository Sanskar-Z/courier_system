import express from 'express';
const router = express.Router();
import * as reportsController from '../controllers/reports.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/advanced', authenticate, authorize(['admin', 'staff']), reportsController.getAdvancedReports);
router.get('/top-couriers', authenticate, authorize(['admin', 'staff']), reportsController.getTopCouriers);

export default router;