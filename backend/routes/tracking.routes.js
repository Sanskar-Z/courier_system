const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/:tracking_no', trackingController.getTrackingHistory);
router.post('/event', authenticate, authorize(['admin', 'staff']), trackingController.addEvent);
router.post('/delay', authenticate, authorize(['admin', 'staff']), trackingController.reportDelay);

module.exports = router;
