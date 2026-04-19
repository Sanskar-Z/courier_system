import express from 'express';
const router = express.Router();
import * as dfController from '../controllers/delivery_failures.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

// Q39 — List unresolved delivery failures
router.get('/',    authenticate, authorize(['admin', 'staff']), dfController.getDeliveryFailures);

// POST — log a new failure from UI form
router.post('/',   authenticate, authorize(['admin', 'staff']), dfController.createDeliveryFailure);

// Q18 — Physical DELETE a resolved delivery failure record (admin only)
router.delete('/:id', authenticate, authorize(['admin']), dfController.resolveDeliveryFailure);

export default router;
