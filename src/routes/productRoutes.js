const express = require('express');

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const {
    authenticateToken
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:pid', getProductById);

// Protected by JWT
router.post('/', authenticateToken, createProduct);
router.put('/:pid', authenticateToken, updateProduct);
router.delete('/:pid', authenticateToken, deleteProduct);

module.exports = router;