const express = require('express');

const {
    createShipment,
    getShipments,
    updateShipmentStatus
} = require('../controllers/shipmentController');

const {
    authenticateToken
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/', createShipment);
router.get('/', getShipments);
router.put('/:shipid', updateShipmentStatus);

module.exports = router;