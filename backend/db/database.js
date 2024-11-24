const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');

        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error running schema.sql:', err.message);
            } else {
                console.log('Database schema applied successfully.');
            }
        });
    }
});

module.exports = db;
