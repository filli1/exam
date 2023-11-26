const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');


exports.newOrder = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const {id, user_id, product_id, order_date, price, quantity} = req.body;
    db.run(`INSERT INTO orders (id, user_id, product_id, price, quantity) VALUES (?, ?, ?, ?, ?)`, [id, user_id, product_id, price, quantity], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A order has been inserted with id ${this.lastID}`);
        res.send(`Order created successfully with id ${this.lastID}`);
    });

    db.close();
}

exports.getOrdersbyUser = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.all(`SELECT * FROM orders WHERE user_id=?`, [id], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(rows);
    });

    db.close();
}
