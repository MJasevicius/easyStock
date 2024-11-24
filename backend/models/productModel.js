const db = require('../db/database');

const createProduct = (product, callback) => {
    const query = `
        INSERT INTO products (location, name, photo, unit, price, count, alert_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        product.location,
        product.name,
        product.photo,
        product.unit,
        product.price,
        product.count,
        product.alert_level,
    ];

    db.run(query, values, function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID });
    });
};

const getAllProducts = (callback) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
};

module.exports = { createProduct, getAllProducts };
