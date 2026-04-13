import express from 'express';
const router = express.Router();
import * as deliveryController from '../controllers/delivery.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const deliverySchema = Joi.object({
    shipment_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    courier_id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    status: Joi.string().valid('Pending', 'Successful', 'Failed').required(),
    recipient_signature: Joi.string().allow('', null),
    notes: Joi.string().allow('', null)
});

router.post('/', authenticate, authorize(['admin', 'staff', 'courier']), upload.single('proof'), validate(deliverySchema), deliveryController.recordDelivery);
router.get('/:id', authenticate, authorize(['admin', 'staff']), deliveryController.getDeliveryById);

export default router;
