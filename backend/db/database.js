const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const schemaPath = path.join(__dirname, 'schema.sql');

let db;

try {
    db = new Database(dbPath);
    console.log('Connected to SQLite database.');

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database schema applied successfully.');
} catch (err) {
    console.error('Error connecting to database or applying schema:', err.message);
    process.exit(1);
}

module.exports = db;
