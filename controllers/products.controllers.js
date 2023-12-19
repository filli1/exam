const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

//Add a product to the database to be displayed on the website
exports.addProduct = async (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id, name, price, image, description } = req.body;

    const product = await stripe.products.create({
        name: name,
        default_price_data: {
            currency: 'dkk',
            unit_amount: price * 100,
        }
    });

    db.run(`INSERT INTO products (id, name, price, image, stripe_id, stripe_price_id, description) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, name, price, image, product.id, product.default_price, description], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send(`Product created successfully with id ${this.lastID}`);
    });

    db.close();
}

//Function that can be used to delete a product from the database - not directly implemented in the website.
exports.deleteProduct = async (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.run(`DELETE FROM products WHERE id=?`, [id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send(`Product deleted successfully with id ${id}`);
    });

    db.close();
}

//Get a single product from the database from the product ID
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

//Get all products from the database - used to display all products on the website
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