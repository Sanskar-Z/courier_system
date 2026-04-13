import express from 'express';
const router = express.Router();
import * as employeesController from '../controllers/employees.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

const employeeSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'staff', 'customer').optional(),
    hub_id: Joi.number().integer().allow(null).optional(),
    employee_role: Joi.string().required()
});

router.get('/', authenticate, authorize(['admin']), employeesController.getEmployees);
router.post('/', authenticate, authorize(['admin']), validate(employeeSchema), employeesController.createEmployee);
router.put('/:id', authenticate, authorize(['admin']), validate(employeeSchema), employeesController.updateEmployee);

export default router;
