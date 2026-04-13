import express from 'express';
const router = express.Router();
import * as hubsController from '../controllers/hubs.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const hubSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    capacity: Joi.number().integer().min(0).optional()
});

router.get('/', authenticate, authorize(['admin', 'staff']), hubsController.getHubs);
router.post('/', authenticate, authorize(['admin']), validate(hubSchema), hubsController.createHub);
router.put('/:id', authenticate, authorize(['admin']), validate(hubSchema), hubsController.updateHub);

export default router;
