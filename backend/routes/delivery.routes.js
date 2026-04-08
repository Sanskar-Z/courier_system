import express from 'express';
const router = express.Router();
import * as deliveryController from '../controllers/delivery.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.post('/', authenticate, authorize(['admin', 'staff', 'courier']), deliveryController.recordDelivery);

export default router;
