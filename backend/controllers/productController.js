const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'database.db');
const db = new Database(dbPath);

const createProduct = (req, res) => {
    console.log('POST /products - Creating a new product...');
    const { location, name, photo, unit, price, count, alert_level, more_info } = req.body;

    const productQuery = `
        INSERT INTO products (location, name, photo, unit, price, count, alert_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const productValues = [location, name, photo, unit, price, count, alert_level];

    try {
        const stmt = db.prepare(productQuery);
        const info = stmt.run(...productValues);
        const productId = info.lastInsertRowid;
        console.log(`Product created with ID: ${productId}`);

        if (more_info) {
            const infoQuery = `
                INSERT INTO more_info (product_id, info1, info2, info3, info4, info5) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const infoValues = [productId, ...more_info];

            const infoStmt = db.prepare(infoQuery);
            infoStmt.run(...infoValues);
            console.log('More info added successfully.');
        }

        res.status(201).json({ success: true, id: productId });
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Get All Products
const getAllProducts = (req, res) => {
    console.log('GET /products - Fetching all products with associated more_info...');
    
    const query = `
        SELECT 
            p.*, 
            mi.info1, mi.info2, mi.info3, mi.info4, mi.info5
        FROM 
            products p
        LEFT JOIN 
            more_info mi 
        ON 
            p.id = mi.product_id
    `;

    try {
        const stmt = db.prepare(query);
        const rows = stmt.all();

        // Transform rows into a nested format where more_info is part of the product object
        const products = rows.reduce((acc, row) => {
            const { id, location, name, photo, unit, price, count, alert_level, created_at, updated_at, info1, info2, info3, info4, info5 } = row;

            if (!acc[id]) {
                acc[id] = {
                    id,
                    location,
                    name,
                    photo,
                    unit,
                    price,
                    count,
                    alert_level,
                    created_at,
                    updated_at,
                    more_info: null
                };
            }

            // Add more_info if available
            if (info1 || info2 || info3 || info4 || info5) {
                acc[id].more_info = { info1, info2, info3, info4, info5 };
            }

            return acc;
        }, {});

        // Convert the object to an array
        res.status(200).json(Object.values(products));
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Get Product by ID
const getProductById = (req, res) => {
    console.log(`GET /products/${req.params.id} - Fetching product by ID...`);
    const { id } = req.params;

    const query = 'SELECT * FROM products WHERE id = ?';
    try {
        const stmt = db.prepare(query);
        const row = stmt.get(id);
        if (!row) return res.status(404).json({ message: 'Product not found.' });

        res.status(200).json(row);
    } catch (err) {
        console.error('Error fetching product by ID:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Update Product
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

    try {
        const stmt = db.prepare(query);
        const info = stmt.run(...values);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        console.log(`Product with ID: ${id} updated.`);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ error: 'Internal server error, please try again later.' });
    }
};

// Delete Product
const deleteProduct = (req, res) => {
    console.log(`DELETE /products/${req.params.id} - Deleting product...`);
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    try {
        const stmt = db.prepare(query);
        const info = stmt.run(id);

        if (info.changes === 0) return res.status(404).json({ message: 'Product not found.' });

        console.log(`Product with ID: ${id} deleted.`);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ error: err.message });
    }
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
    try {
        const checkStmt = db.prepare(checkQuery);
        const row = checkStmt.get(id);

        if (row) {
            // If record exists, update the more_info for the given product_id
            const updateQuery = `
                UPDATE more_info 
                SET info1 = ?, info2 = ?, info3 = ?, info4 = ?, info5 = ?
                WHERE product_id = ?
            `;
            const updateValues = [info1, info2, info3, info4, info5, id];

            const updateStmt = db.prepare(updateQuery);
            updateStmt.run(...updateValues);

            console.log(`More info updated for product ID: ${id}`);
            res.status(200).json({ success: true });
        } else {
            // If no record exists, insert a new record
            const insertQuery = `
                INSERT INTO more_info (product_id, info1, info2, info3, info4, info5) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const insertValues = [id, info1, info2, info3, info4, info5];

            const insertStmt = db.prepare(insertQuery);
            insertStmt.run(...insertValues);

            console.log(`More info added for product ID: ${id}`);
            res.status(201).json({ success: true });
        }
    } catch (err) {
        console.error('Error adding/updating more info:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Search Products
const searchProducts = (req, res) => {
    console.log('GET /products/search - Searching products...');
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Missing search term' });
    }

    const createFtsTableSql = `
        CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
            location,
            name,
            unit,
            content='products',
            content_rowid='id'
        );
    `;

    try {
        db.exec(createFtsTableSql);

        // Rebuild the FTS index
        try {
            db.prepare(`INSERT INTO products_fts(products_fts) VALUES('rebuild');`).run();
        } catch (err) {
            if (!err.message.includes('constraint failed')) {
                throw err;
            }
        }

        const query = `
            SELECT p.*, mi.info1, mi.info2, mi.info3, mi.info4, mi.info5
            FROM products_fts
            JOIN products p ON products_fts.rowid = p.id
            LEFT JOIN more_info mi ON p.id = mi.product_id
            WHERE products_fts MATCH ?;
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all(searchTerm);

        const products = rows.reduce((acc, row) => {
            const {
                id, location, name, photo, unit, price, count,
                alert_level, created_at, updated_at,
                info1, info2, info3, info4, info5
            } = row;

            if (!acc[id]) {
                acc[id] = {
                    id,
                    location,
                    name,
                    photo,
                    unit,
                    price,
                    count,
                    alert_level,
                    created_at,
                    updated_at,
                    more_info: null
                };
            }

            if (info1 || info2 || info3 || info4 || info5) {
                acc[id].more_info = { info1, info2, info3, info4, info5 };
            }

            return acc;
        }, {});

        res.status(200).json(Object.values(products));
    } catch (err) {
        console.error('Error during search:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addMoreInfoToProduct,
    searchProducts
};
