const db = require('../db/database');

const createOrder = (order, callback) => {
    const query = `
        INSERT INTO orders (date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        order.date || new Date().toISOString(),
        order.comment,
        order.client,
        order.client_code,
        order.client_pvm_code,
        order.keep_in_inventory || false,
        order.discount || 0,
    ];

    db.run(query, values, function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID });
    });
};

module.exports = { createOrder };
