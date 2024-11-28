const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');

let db;
try {
    db = new Database('./db/database.db');
    console.log('Connected to SQLite database.');

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database schema applied successfully.');
} catch (err) {
    console.error('Error connecting to database:', err.message);
}

module.exports = db;
