const express = require('express');

const {
    createOrder,
    getMyOrders,
    getOrderById
} = require('../controllers/orderController');

const {
    authenticateToken
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:oid', getOrderById);

module.exports = router;