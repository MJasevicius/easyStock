const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const db = require('./db/database');
const fs = require('fs');
const path = require('path');

// Apply middleware
app.use(express.json());

// Initialize database schema
const schemaPath = path.join(__dirname, 'db', 'schema.sql');
fs.readFile(schemaPath, 'utf-8', (err, schema) => {
    if (err) return console.error('Error reading schema:', err.message);

    db.exec(schema, (err) => {
        if (err) console.error('Error initializing database schema:', err.message);
        else console.log('Database schema initialized.');
    });
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
