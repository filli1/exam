const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');


exports.addProduct = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id, name, price, image } = req.body;

    db.run(`INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)`, [id, name, price, image], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A product has been inserted with id ${this.lastID}`);
        res.send(`Product created successfully with id ${this.lastID}`);
    });

    db.close();
}


exports.deleteProduct = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.run(`DELETE FROM products WHERE id=?`, [id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A product has been deleted with id ${id}`);
        res.send(`Product deleted successfully with id ${id}`);
    });

    db.close();
}

exports.getoneProduct = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.get(`SELECT * FROM products WHERE id=?`, [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(row);
    });

    db.close();
}

exports.getAllProducts = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });

    db.close();
}