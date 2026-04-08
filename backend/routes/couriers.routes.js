import express from 'express';
const router = express.Router();
import * as couriersController from '../controllers/couriers.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/', authenticate, authorize(['admin', 'staff']), couriersController.getCouriers);
router.post('/', authenticate, authorize(['admin']), couriersController.createCourier);

export default router;
