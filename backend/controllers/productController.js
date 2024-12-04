// File: productController.js

const path = require('path');
const Database = require('better-sqlite3');
const Fuse = require('fuse.js'); // Import Fuse.js

const dbPath = path.join(__dirname, '..', 'db', 'database.db');
const db = new Database(dbPath);

// Create FTS table with all searchable fields (if needed)
const createFtsTableSql = `
    CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
        id UNINDEXED,
        location,
        name,
        unit,
        price,
        count,
        alert_level,
        created_at,
        info1,
        info2,
        info3,
        info4,
        info5,
        content=''
    );
`;

db.exec(createFtsTableSql);

// Function to rebuild the FTS index (Optional)
function rebuildFtsIndex() {
    db.exec('DELETE FROM products_fts;');
    const insertFtsDataSql = `
        INSERT INTO products_fts (
            id, location, name, unit, price, count, alert_level, created_at,
            info1, info2, info3, info4, info5
        )
        SELECT
            p.id, p.location, p.name, p.unit,
            CAST(p.price AS TEXT), CAST(p.count AS TEXT), CAST(p.alert_level AS TEXT), p.created_at,
            mi.info1, mi.info2, mi.info3, mi.info4, mi.info5
        FROM products p
        LEFT JOIN more_info mi ON p.id = mi.product_id;
    `;
    db.exec(insertFtsDataSql);
}

// Call this function on startup if needed
// rebuildFtsIndex();

// Helper function to update FTS index for a given product ID
function updateFtsIndex(productId) {
    const selectDataSql = `
        SELECT
            p.id, p.location, p.name, p.unit,
            CAST(p.price AS TEXT) AS price, CAST(p.count AS TEXT) AS count,
            CAST(p.alert_level AS TEXT) AS alert_level, p.created_at,
            mi.info1, mi.info2, mi.info3, mi.info4, mi.info5
        FROM products p
        LEFT JOIN more_info mi ON p.id = mi.product_id
        WHERE p.id = ?
    `;
    const data = db.prepare(selectDataSql).get(productId);

    if (data) {
        // Delete existing entry in 'products_fts' for this productId
        const deleteFtsSql = `DELETE FROM products_fts WHERE id = ?`;
        db.prepare(deleteFtsSql).run(productId);

        // Insert new data into 'products_fts'
        const insertFtsSql = `
            INSERT INTO products_fts (
                id, location, name, unit, price, count, alert_level, created_at,
                info1, info2, info3, info4, info5
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.prepare(insertFtsSql).run(
            data.id,
            data.location,
            data.name,
            data.unit,
            data.price,
            data.count,
            data.alert_level,
            data.created_at,
            data.info1,
            data.info2,
            data.info3,
            data.info4,
            data.info5
        );
    }
}

const createProduct = (req, res) => {
    const { location, name, photo, unit, price, count, alert_level, more_info } = req.body;
    const productQuery = `INSERT INTO products (location, name, photo, unit, price, count, alert_level) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const productValues = [location, name, photo, unit, price, count, alert_level];
    try {
      const stmt = db.prepare(productQuery);
      const info = stmt.run(...productValues);
      const productId = info.lastInsertRowid;
      if (more_info) {
        const infoQuery = `INSERT INTO more_info (product_id, info1, info2, info3, info4, info5) VALUES (?, ?, ?, ?, ?, ?)`;
        const paddedMoreInfo = [...more_info, null, null, null, null, null].slice(0, 5);
        const infoStmt = db.prepare(infoQuery);
        infoStmt.run(productId, ...paddedMoreInfo);
      }
      res.status(201).json({ success: true, id: productId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getAllProducts = (req, res) => {
    console.log('GET /products - Fetching all products...');
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

        const products = rows.map((row) => ({
            id: row.id,
            location: row.location,
            name: row.name,
            photo: row.photo,
            unit: row.unit,
            price: row.price,
            count: row.count,
            alert_level: row.alert_level,
            created_at: row.created_at,
            updated_at: row.updated_at,
            orderCount: row.orderCount,
            more_info: [row.info1, row.info2, row.info3, row.info4, row.info5].filter(Boolean),
        }));

        console.log(`Fetched ${products.length} products.`);
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: err.message });
    }
};

  
  const getProductById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT p.*, mi.info1, mi.info2, mi.info3, mi.info4, mi.info5 FROM products p LEFT JOIN more_info mi ON p.id = mi.product_id WHERE p.id = ?`;
    try {
      const stmt = db.prepare(query);
      const row = stmt.get(id);
      if (!row) return res.status(404).json({ message: 'Product not found.' });
      const product = {
        ...row,
        more_info: [row.info1, row.info2, row.info3, row.info4, row.info5].filter(Boolean),
      };
      res.status(200).json(product);
    } catch (err) {
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
  
      // **Update FTS index**
      updateFtsIndex(id);
  
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

        // Delete from FTS index
        const deleteFtsSql = `DELETE FROM products_fts WHERE id = ?`;
        db.prepare(deleteFtsSql).run(id);

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

            // Update FTS index
            updateFtsIndex(id);

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

            // Update FTS index
            updateFtsIndex(id);

            res.status(201).json({ success: true });
        }
    } catch (err) {
        console.error('Error adding/updating more info:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Search Products using Fuse.js for fuzzy matching
const searchProducts = (req, res) => {
    console.log('GET /products/search - Searching products...');
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Missing search term' });
    }

    try {
        // Fetch all products with associated more_info
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
        const stmt = db.prepare(query);
        const products = stmt.all();

        // Transform products to include 'more_info' field properly
        const transformedProducts = products.map(product => {
            const {
                id, location, name, photo, unit, price, count,
                alert_level, created_at, updated_at,
                info1, info2, info3, info4, info5
            } = product;

            return {
                id: id.toString(), // Convert to string for searching
                location,
                name,
                photo,
                unit,
                price: price !== null ? price.toString() : '',
                count: count !== null ? count.toString() : '',
                alert_level: alert_level !== null ? alert_level.toString() : '',
                created_at: created_at ? created_at.toString() : '',
                updated_at: updated_at ? updated_at.toString() : '',
                more_info: {
                    info1: info1 || '',
                    info2: info2 || '',
                    info3: info3 || '',
                    info4: info4 || '',
                    info5: info5 || ''
                }
            };
        });

        // Initialize Fuse.js with the products data
        const fuseOptions = {
            keys: [
                'id',
                'location',
                'name',
                'unit',
                'price',
                'count',
                'alert_level',
                'created_at',
                'more_info.info1',
                'more_info.info2',
                'more_info.info3',
                'more_info.info4',
                'more_info.info5'
            ],
            threshold: 0.5, // Adjust this value to make the search less or more strict
            includeScore: true,
            ignoreLocation: true,
            findAllMatches: true,
            useExtendedSearch: true,
            minMatchCharLength: 2,
        };

        const fuse = new Fuse(transformedProducts, fuseOptions);

        // Perform the search
        const results = fuse.search(searchTerm);

        // Extract the products from the results
        const matchedProducts = results.map(result => result.item);

        res.status(200).json(matchedProducts);
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
