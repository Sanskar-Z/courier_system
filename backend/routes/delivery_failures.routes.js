import express from 'express';
const router = express.Router();
import * as deliveryFailuresController from '../controllers/delivery_failures.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const logFailureSchema = Joi.object({
    shipment_id: Joi.number().integer().required(),
    reason: Joi.string().required(),
    retry_scheduled: Joi.boolean().optional()
});

router.post('/', authenticate, authorize(['admin', 'staff']), validate(logFailureSchema), deliveryFailuresController.logDeliveryFailure);
router.get('/', authenticate, authorize(['admin', 'staff']), deliveryFailuresController.getDeliveryFailures);

export default router;