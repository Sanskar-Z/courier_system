import express from 'express';
const router = express.Router();
import * as auditLogsController from '../controllers/audit_logs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/', authenticate, authorize(['admin']), auditLogsController.getAuditLogs);

export default router;