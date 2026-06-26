const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.get('/provinces', shippingController.getProvinces);
router.get('/cities/:provinceId', shippingController.getCities);
router.post('/cost', shippingController.calculateCost);

module.exports = router;
