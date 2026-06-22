const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
// const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes (Auth commented out temporarily for testing)
router.post('/', upload.single('gambarFile'), productController.create);
router.put('/:id', upload.single('gambarFile'), productController.update);
router.delete('/:id', productController.delete);
router.patch('/:id/stok', productController.updateStok);

module.exports = router;
