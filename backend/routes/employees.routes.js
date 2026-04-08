import express from 'express';
const router = express.Router();
import * as employeesController from '../controllers/employees.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/', authenticate, authorize(['admin']), employeesController.getEmployees);
router.post('/', authenticate, authorize(['admin']), employeesController.createEmployee);

export default router;
