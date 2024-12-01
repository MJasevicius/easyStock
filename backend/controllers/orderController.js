const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'database.db');
const db = new Database(dbPath);


// Create Order
const createOrder = (req, res) => {
    console.log('POST /orders - Creating a new order...');
    const { date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount } = req.body;

    const query = `
        INSERT INTO orders (date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        date || new Date().toISOString(),
        comment,
        client,
        client_code,
        client_pvm_code,
        keep_in_inventory,
        discount
    ];

    try {
        const stmt = db.prepare(query);
        const info = stmt.run(...values);
        const orderId = info.lastInsertRowid;
        console.log(`Order created with ID: ${orderId}`);
        res.status(201).json({ success: true, id: orderId });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Add Item to Order
const addOrderItems = (req, res) => {
    console.log(`POST /orders/${req.params.orderId}/items - Adding items to order...`);
    const { orderId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required and must not be empty.' });
    }

    const insertQuery = `
        INSERT INTO order_items (order_id, item_id, price, count) 
        VALUES (?, ?, ?, ?)
    `;

    // Start a transaction to handle multiple inserts
    const insertItemsTransaction = db.transaction((items) => {
        for (const item of items) {
            const { id, price, count } = item;
            const stmt = db.prepare(insertQuery);
            stmt.run(orderId, id, price, count);
        }

        // Update total_price in orders table
        const totalItemPriceRow = db.prepare(`
            SELECT SUM(price * count) AS total_item_price 
            FROM order_items 
            WHERE order_id = ?
        `).get(orderId);

        const totalItemPrice = totalItemPriceRow ? totalItemPriceRow.total_item_price : 0;

        // Get discount from orders table
        const orderRow = db.prepare(`
            SELECT discount FROM orders WHERE id = ?
        `).get(orderId);

        const discount = orderRow ? orderRow.discount : 0;
        const finalPrice = totalItemPrice - discount;

        // Update the total price with the discount applied
        db.prepare(`
            UPDATE orders 
            SET total_price = ? 
            WHERE id = ?
        `).run(finalPrice, orderId);
    });

    try {
        insertItemsTransaction(items);
        console.log(`Items added to order ID: ${orderId}`);
        res.status(201).json({ message: 'Items added and total price updated with discount.' });
    } catch (err) {
        console.error('Error adding items to order:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Get All Items for an Order
const getOrderItems = (req, res) => {
    console.log(`GET /orders/${req.params.orderId}/items - Fetching items for order...`);
    const { orderId } = req.params;

    const query = `
        SELECT oi.order_id, oi.item_id, oi.price, oi.count, p.name, p.unit 
        FROM order_items oi
        JOIN products p ON oi.item_id = p.id
        WHERE oi.order_id = ?
    `;

    try {
        const stmt = db.prepare(query);
        const rows = stmt.all(orderId);
        console.log(`Fetched ${rows.length} items for order ID: ${orderId}`);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching order items:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Get All Info About Orders (With Items)
const getOrderInfo = (req, res) => {
    console.log('GET /orders/info - Fetching all orders with associated items...');
    const ordersQuery = 'SELECT * FROM orders';
    const itemsQuery = `
        SELECT oi.order_id, oi.item_id, oi.price, oi.count, p.name, p.unit 
        FROM order_items oi
        JOIN products p ON oi.item_id = p.id
    `;

    try {
        const ordersStmt = db.prepare(ordersQuery);
        const orders = ordersStmt.all();

        const itemsStmt = db.prepare(itemsQuery);
        const items = itemsStmt.all();

        // Map items to their respective orders and ensure no duplication
        const ordersWithItems = orders.map(order => {
            // Filter items for the current order and construct the order object
            const orderItems = items.filter(item => item.order_id === order.id);
            return {
                ...order,
                items: orderItems, // Attach the items to the order
                total_price: order.total_price, // Use the total_price from the orders table
            };
        });

        console.log(`Fetched info for ${ordersWithItems.length} orders.`);
        res.status(200).json(ordersWithItems);
    } catch (err) {
        console.error('Error fetching order info:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createOrder,
    addOrderItems,
    getOrderItems,
    getOrderInfo,
};
