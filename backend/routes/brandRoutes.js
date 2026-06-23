const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth'); // admin only? 
// For now, checking how products are protected. Assuming auth might be required.
// Looking at how products are routed... let's just make get public, and post/delete protected if auth is needed. 
// But actually, we don't have auth middleware applied on product create in app.js? We will see.
// Let's just create the basic routes.

router.get('/', brandController.getBrands);
router.post('/', upload.single('logoFile'), brandController.createBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
