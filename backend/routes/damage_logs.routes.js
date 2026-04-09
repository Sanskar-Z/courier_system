import express from 'express';
const router = express.Router();
import * as damageLogsController from '../controllers/damage_logs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const logDamageSchema = Joi.object({
    shipment_id: Joi.number().integer().required(),
    description: Joi.string().required(),
    severity: Joi.string().valid('Minor', 'Major', 'Critical').required()
});

router.post('/', authenticate, authorize(['admin', 'staff']), validate(logDamageSchema), damageLogsController.logDamage);
router.get('/', authenticate, authorize(['admin', 'staff']), damageLogsController.getDamageLogs);

export default router;