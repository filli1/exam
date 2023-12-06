const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const stripe = require('stripe')('sk_test_51O52F8FfrmyivZDpDbhTUpKWHJYF6njcwxBg5mRge22kAAd7DvSRQWtRaprIaZtS3LJNpST0RvhHdgll2DZFVlmk00RH7ZGpuQ');
const port = 3000;

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

const YOUR_DOMAIN = `http://localhost:${port}`;

exports.createCheckoutSession = async (req, res) => {
    console.log(req.body);
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cart`,
        });

        // Send the session URL in a JSON response
        res.json({ url: session.url });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error creating checkout session");
    }
};
