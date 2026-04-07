const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize(['admin', 'staff', 'customer']), shipmentController.createShipment);
router.get('/', authenticate, shipmentController.getShipments);
router.get('/report', authenticate, authorize(['admin', 'staff']), shipmentController.getSLAReport);
router.put('/:id/assign', authenticate, authorize(['admin', 'staff']), shipmentController.assignCourier);
router.post('/:id/hub', authenticate, authorize(['admin', 'staff']), shipmentController.linkHub);

module.exports = router;
