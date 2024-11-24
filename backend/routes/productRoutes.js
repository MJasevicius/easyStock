const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../models/productModel');

router.post('/', (req, res) => {
    createProduct(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: result.id });
    });
});

router.get('/', (req, res) => {
    getAllProducts((err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(products);
    });
});

module.exports = router;
