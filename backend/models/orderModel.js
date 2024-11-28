const Database = require('better-sqlite3');
const db = new Database('../db/database.db');

const createOrder = (order) => {
    const query = `
        INSERT INTO orders (date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const stmt = db.prepare(query);

    const values = [
        order.date || new Date().toISOString(),
        order.comment,
        order.client,
        order.client_code,
        order.client_pvm_code,
        order.keep_in_inventory || false,
        order.discount || 0,
    ];

    const info = stmt.run(...values);

    return { id: info.lastInsertRowid };
};

module.exports = { createOrder };
