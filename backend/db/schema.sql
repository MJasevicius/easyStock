CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    name TEXT NOT NULL,
    photo TEXT,
    unit TEXT NOT NULL,
    price REAL NOT NULL,
    count INTEGER NOT NULL,
    alert_level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS more_info (
    product_id INTEGER NOT NULL,
    info1 TEXT,
    info2 TEXT,
    info3 TEXT,
    info4 TEXT,
    info5 TEXT,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    client TEXT,
    client_code TEXT,
    client_pvm_code TEXT,
    keep_in_inventory BOOLEAN DEFAULT FALSE,
    discount REAL
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    price REAL NOT NULL,
    count INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES products (id) ON DELETE CASCADE
);
