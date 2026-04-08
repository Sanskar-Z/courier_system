import express from 'express';
const router = express.Router();
import * as trackingController from '../controllers/tracking.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/:tracking_no', trackingController.getTrackingHistory);
router.post('/event', authenticate, authorize(['admin', 'staff']), trackingController.addEvent);
router.post('/delay', authenticate, authorize(['admin', 'staff']), trackingController.reportDelay);

export default router;
