const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    addOrderItems, 
    getOrderItems, 
    getOrderInfo 
} = require('../controllers/orderController');

// Create Order
router.post('/', createOrder);

// Add Items to Order
router.post('/:orderId/items', addOrderItems);

// Get Items for an Order
router.get('/:orderId/items', getOrderItems);

// Get All Info About Orders
router.get('/info', getOrderInfo);

module.exports = router;
