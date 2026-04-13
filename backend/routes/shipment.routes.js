import express from 'express';
const router = express.Router();
import * as shipmentController from '../controllers/shipment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const createShipmentSchema = Joi.object({
    sender_name: Joi.string().required(),
    sender_address: Joi.string().required(),
    receiver_name: Joi.string().required(),
    receiver_address: Joi.string().required(),
    weight: Joi.number().positive().required(),
    service_type: Joi.string().valid('Standard', 'Express', 'Overnight').required(),
    customer_id: Joi.number().integer().optional()
});

router.post('/', authenticate, authorize(['admin', 'staff', 'customer']), validate(createShipmentSchema), shipmentController.createShipment);
router.get('/', authenticate, shipmentController.getShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
router.get('/report', authenticate, authorize(['admin', 'staff']), shipmentController.getSLAReport);
router.put('/:id/assign', authenticate, authorize(['admin', 'staff']), shipmentController.assignCourier);
router.post('/:id/hub', authenticate, authorize(['admin', 'staff']), shipmentController.linkHub);

export default router;
