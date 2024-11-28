const Database = require('better-sqlite3');
const db = new Database('../db/database.db');

const createProduct = (product) => {
    const query = `
        INSERT INTO products (location, name, photo, unit, price, count, alert_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(query);
    const info = stmt.run(
        product.location,
        product.name,
        product.photo,
        product.unit,
        product.price,
        product.count,
        product.alert_level
    );
    return { id: info.lastInsertRowid };
};

const getAllProducts = () => {
    const stmt = db.prepare('SELECT * FROM products');
    const rows = stmt.all();
    return rows;
};

module.exports = { createProduct, getAllProducts };
