import express from 'express';
const router = express.Router();
import * as trackingController from '../controllers/tracking.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const eventSchema = Joi.object({
    shipment_id: Joi.number().integer().required(),
    status: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().allow('', null)
});

const delaySchema = Joi.object({
    shipment_id: Joi.number().integer().required(),
    reason: Joi.string().required()
});

router.get('/:tracking_no', trackingController.getTrackingHistory);
router.get('/events/list', authenticate, trackingController.getEventsByShipmentId);
router.post('/event', authenticate, authorize(['admin', 'staff']), validate(eventSchema), trackingController.addEvent);
router.post('/delay', authenticate, authorize(['admin', 'staff']), validate(delaySchema), trackingController.reportDelay);

export default router;
