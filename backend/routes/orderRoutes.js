const express = require('express');
const router = express.Router();
const { createOrder } = require('../models/orderModel');

router.post('/', (req, res) => {
    createOrder(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: result.id });
    });
});

module.exports = router;
