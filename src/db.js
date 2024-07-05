import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY, content TEXT)');
});

export default db;
