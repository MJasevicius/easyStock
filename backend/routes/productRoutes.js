const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    addMoreInfoToProduct 
} = require('../controllers/productController');

// Create Product
router.post('/', createProduct);

// Get All Products
router.get('/', getAllProducts);

// Get Product by ID
router.get('/:id', getProductById);

// Update Product
router.put('/:id', updateProduct);

// Delete Product
router.delete('/:id', deleteProduct);

// Add More Info to Product
router.post('/:id/more-info', addMoreInfoToProduct);

module.exports = router;
