import express from 'express';
const router = express.Router();
import * as shipmentController from '../controllers/shipment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.post('/', authenticate, authorize(['admin', 'staff', 'customer']), shipmentController.createShipment);
router.get('/', authenticate, shipmentController.getShipments);
router.get('/report', authenticate, authorize(['admin', 'staff']), shipmentController.getSLAReport);
router.put('/:id/assign', authenticate, authorize(['admin', 'staff']), shipmentController.assignCourier);
router.post('/:id/hub', authenticate, authorize(['admin', 'staff']), shipmentController.linkHub);

export default router;
