const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getAllOrders, 
    addOrderItem, 
    getOrderItems, 
    getOrderInfo 
} = require('../controllers/orderController');

// Create Order
router.post('/', createOrder);

// Get All Orders
router.get('/', getAllOrders);

// Add Items to Order
router.post('/:orderId/items', addOrderItem);

// Get Items for an Order
router.get('/:orderId/items', getOrderItems);

// Get All Info About Orders
router.get('/info', getOrderInfo);

module.exports = router;
