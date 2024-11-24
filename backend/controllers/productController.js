const db = require('../db/database');

// Create Product
const createProduct = (req, res) => {
    console.log('POST /products - Creating a new product...');
    const { location, name, photo, unit, price, count, alert_level, more_info } = req.body;

    const productQuery = `
        INSERT INTO products (location, name, photo, unit, price, count, alert_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const productValues = [location, name, photo, unit, price, count, alert_level];

    db.run(productQuery, productValues, function (err) {
        if (err) {
            console.error('Error creating product:', err.message);
            return res.status(500).json({ error: err.message });
        }

        const productId = this.lastID;
        console.log(`Product created with ID: ${productId}`);

        if (more_info) {
            const infoQuery = `
                INSERT INTO more_info (product_id, info1, info2, info3, info4, info5) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const infoValues = [productId, ...more_info];

            db.run(infoQuery, infoValues, (err) => {
                if (err) {
                    console.error('Error adding more info:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                console.log('More info added successfully.');
            });
        }

        res.status(201).json({ success: true, id: productId });
    });
};

// Get All Products
const getAllProducts = (req, res) => {
    console.log('GET /products - Fetching all products...');
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Get Product by ID
const getProductById = (req, res) => {
    console.log(`GET /products/${req.params.id} - Fetching product by ID...`);
    const { id } = req.params;

    const query = 'SELECT * FROM products WHERE id = ?';
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error fetching product by ID:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!row) return res.status(404).json({ message: 'Product not found.' });

        res.status(200).json(row);
    });
};

const updateProduct = (req, res) => {
    console.log(`PUT /products/${req.params.id} - Updating product...`);
    const { id } = req.params;
    
    const allowedFields = ['location', 'name', 'photo', 'unit', 'price', 'count', 'alert_level'];  
    const updates = [];
    const values = [];
    
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    });

    if (updates.length > 0) {
        updates.push("updated_at = CURRENT_TIMESTAMP");
    } else {
        return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    
    const query = `
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = ?
    `;
    
    db.run(query, values, function (err) {
        if (err) {
            console.error('Error updating product:', err.message);
            return res.status(500).json({ error: 'Internal server error, please try again later.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        console.log(`Product with ID: ${id} updated.`);
        res.status(200).json({ success: true });
    });
};



// Delete Product
const deleteProduct = (req, res) => {
    console.log(`DELETE /products/${req.params.id} - Deleting product...`);
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting product:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) return res.status(404).json({ message: 'Product not found.' });

        console.log(`Product with ID: ${id} deleted.`);
        res.status(200).json({ success: true });
    });
};

// Add More Info to Product
const addMoreInfoToProduct = (req, res) => {
    console.log(`POST /products/${req.params.id}/more-info - Adding more info to product...`);
    const { id } = req.params;
    const { info1, info2, info3, info4, info5 } = req.body;

    // First, check if a record with the same product_id exists
    const checkQuery = `
        SELECT * FROM more_info WHERE product_id = ?
    `;
    
    db.get(checkQuery, [id], (err, row) => {
        if (err) {
            console.error('Error checking product info:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            // If record exists, update the more_info for the given product_id
            const updateQuery = `
                UPDATE more_info 
                SET info1 = ?, info2 = ?, info3 = ?, info4 = ?, info5 = ?
                WHERE product_id = ?
            `;
            const updateValues = [info1, info2, info3, info4, info5, id];

            db.run(updateQuery, updateValues, (err) => {
                if (err) {
                    console.error('Error updating more info:', err.message);
                    return res.status(500).json({ error: err.message });
                }

                console.log(`More info updated for product ID: ${id}`);
                res.status(200).json({ success: true });
            });
        } else {
            // If no record exists, insert a new record
            const insertQuery = `
                INSERT INTO more_info (product_id, info1, info2, info3, info4, info5) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const insertValues = [id, info1, info2, info3, info4, info5];

            db.run(insertQuery, insertValues, (err) => {
                if (err) {
                    console.error('Error adding more info:', err.message);
                    return res.status(500).json({ error: err.message });
                }

                console.log(`More info added for product ID: ${id}`);
                res.status(201).json({ success: true });
            });
        }
    });
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addMoreInfoToProduct,
};
