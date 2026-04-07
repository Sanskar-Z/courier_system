const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize(['admin', 'staff', 'courier']), deliveryController.recordDelivery);

module.exports = router;
