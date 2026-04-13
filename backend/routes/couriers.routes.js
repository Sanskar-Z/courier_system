import express from 'express';
const router = express.Router();
import * as couriersController from '../controllers/couriers.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const courierSchema = Joi.object({
    name: Joi.string().required(),
    vehicle_type: Joi.string().allow('', null),
    contact_number: Joi.string().required(),
    status: Joi.string().valid('Active', 'Inactive', 'On Leave').optional(),
    current_hub_id: Joi.number().integer().allow(null).optional()
});

router.get('/', authenticate, authorize(['admin', 'staff']), couriersController.getCouriers);
router.post('/', authenticate, authorize(['admin']), validate(courierSchema), couriersController.createCourier);
router.put('/:id', authenticate, authorize(['admin']), validate(courierSchema), couriersController.updateCourier);

export default router;
