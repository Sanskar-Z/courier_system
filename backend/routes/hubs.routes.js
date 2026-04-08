import express from 'express';
const router = express.Router();
import * as hubsController from '../controllers/hubs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/', authenticate, authorize(['admin', 'staff']), hubsController.getHubs);
router.post('/', authenticate, authorize(['admin']), hubsController.createHub);

export default router;
