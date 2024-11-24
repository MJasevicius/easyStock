const db = require('../db/database');

// Create Order
const createOrder = (req, res) => {
    console.log('POST /orders - Creating a new order...');
    const { date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount } = req.body;

    const query = `
        INSERT INTO orders (date, comment, client, client_code, client_pvm_code, keep_in_inventory, discount) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [date || new Date().toISOString(), comment, client, client_code, client_pvm_code, keep_in_inventory, discount];

    db.run(query, values, function (err) {
        if (err) {
            console.error('Error creating order:', err.message);
            return res.status(500).json({ error: err.message });
        }

        const orderId = this.lastID;
        console.log(`Order created with ID: ${orderId}`);
        res.status(201).json({ success: true, id: orderId });
    });
};


// Add Item to Order
const addOrderItems = (req, res) => {
    console.log(`POST /orders/${req.params.orderId}/items - Adding items to order...`);
    const { orderId } = req.params;
    const { items } = req.body; // Expecting an array of items

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required and must not be empty.' });
    }

    const insertQuery = `
        INSERT INTO order_items (order_id, item_id, price, count) 
        VALUES (?, ?, ?, ?)
    `;

    // Start a transaction to handle multiple inserts
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        items.forEach((item) => {
            const { item_id, price, count } = item;
            db.run(insertQuery, [orderId, item_id, price, count], (err) => {
                if (err) {
                    console.error('Error adding item to order:', err.message);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                }
            });
        });

        // Commit the transaction after all items are added
        db.run('COMMIT', (err) => {
            if (err) {
                console.error('Error committing transaction:', err.message);
                return res.status(500).json({ error: err.message });
            }

            console.log(`Items added to order ID: ${orderId}`);

            // Update total_price in orders table
            const updateTotalPriceQuery = `
                SELECT SUM(price * count) AS total_item_price 
                FROM order_items 
                WHERE order_id = ?
            `;

            db.get(updateTotalPriceQuery, [orderId], (err, row) => {
                if (err) {
                    console.error('Error calculating total item price:', err.message);
                    return res.status(500).json({ error: err.message });
                }

                // Get discount from orders table
                const getDiscountQuery = 'SELECT discount FROM orders WHERE id = ?';
                db.get(getDiscountQuery, [orderId], (err, order) => {
                    if (err) {
                        console.error('Error fetching discount:', err.message);
                        return res.status(500).json({ error: err.message });
                    }

                    const discount = order ? order.discount : 0;
                    const totalItemPrice = row ? row.total_item_price : 0;
                    const finalPrice = totalItemPrice - discount;

                    // Update the total price with the discount applied
                    const updateTotalPriceWithDiscountQuery = `
                        UPDATE orders 
                        SET total_price = ? 
                        WHERE id = ?
                    `;
                    db.run(updateTotalPriceWithDiscountQuery, [finalPrice, orderId], function (err) {
                        if (err) {
                            console.error('Error updating total price:', err.message);
                            return res.status(500).json({ error: err.message });
                        }
                        console.log(`Total price updated for order ID: ${orderId}`);
                        res.status(201).json({ message: 'Items added and total price updated with discount.' });
                    });
                });
            });
        });
    });
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

    db.all(query, [orderId], (err, rows) => {
        if (err) {
            console.error('Error fetching order items:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log(`Fetched ${rows.length} items for order ID: ${orderId}`);
        res.status(200).json(rows);
    });
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

    db.all(ordersQuery, [], (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).json({ error: err.message });
        }

        db.all(itemsQuery, [], (err, items) => {
            if (err) {
                console.error('Error fetching order items:', err.message);
                return res.status(500).json({ error: err.message });
            }

            // Map items to their respective orders and ensure no duplication
            const ordersWithItems = orders.map(order => {
                // Filter items for the current order and construct the order object
                const orderItems = items.filter(item => item.order_id === order.id);
                return {
                    ...order,
                    items: orderItems, // Attach the items to the order
                    total_price: orderItems.reduce((total, item) => total + (item.price * item.count), 0) - order.discount, // Subtract the discount from total
                };
            });

            console.log(`Fetched info for ${ordersWithItems.length} orders.`);
            res.status(200).json(ordersWithItems);
        });
    });
};


module.exports = {
    createOrder,
    addOrderItem,
    getOrderItems,
    getOrderInfo,
};
