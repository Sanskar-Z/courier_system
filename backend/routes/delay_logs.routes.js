import express from 'express';
const router = express.Router();
import * as delayLogsController from '../controllers/delay_logs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/', authenticate, authorize(['admin', 'staff']), delayLogsController.getDelayLogs);

export default router;
