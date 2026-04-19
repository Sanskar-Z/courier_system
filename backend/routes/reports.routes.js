import express from 'express';
const router = express.Router();
import * as reportsController from '../controllers/reports.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/advanced', authenticate, authorize(['admin', 'staff']), reportsController.getAdvancedReports);
router.get('/top-couriers', authenticate, authorize(['admin', 'staff']), reportsController.getTopCouriers);

// New routes for missing queries Q11–Q28, Q36–Q37
router.get('/hub-activity',          authenticate, authorize(['admin', 'staff']), reportsController.getHubActivity);
router.get('/top-customers',         authenticate, authorize(['admin', 'staff']), reportsController.getTopCustomers);
router.get('/sla-breached-customers',authenticate, authorize(['admin', 'staff']), reportsController.getSlaBreachedCustomers);
router.get('/heavy-shipments',       authenticate, authorize(['admin', 'staff']), reportsController.getHeavyShipments);
router.get('/latest-tracking',       authenticate, authorize(['admin', 'staff']), reportsController.getLatestTrackingPerShipment);
router.get('/courier-hub-pairs',     authenticate, authorize(['admin', 'staff']), reportsController.getCouriersAtSameHub);
router.get('/sla-weight-match',      authenticate, authorize(['admin', 'staff']), reportsController.getShipmentSlaWeightMatch);
router.get('/hub-coverage',          authenticate, authorize(['admin', 'staff']), reportsController.getHubCoverage);
router.get('/breached-service-types',authenticate, authorize(['admin', 'staff']), reportsController.getBreachedServiceTypes);
router.get('/revenue',               authenticate, authorize(['admin', 'staff']), reportsController.getRevenueByService);
router.get('/heaviest-undelivered',  authenticate, authorize(['admin', 'staff']), reportsController.getHeaviestUndelivered);
router.get('/function-report',       authenticate, authorize(['admin', 'staff']), reportsController.getShipmentFunctionReport);

export default router;