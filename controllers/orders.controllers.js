const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);
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
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body,
            mode: 'payment',
            custom_text: {
                submit: {
                  message: 'You\'ll get an email with your order confirmation, and a SMS when your order is ready for pickup.',
                },
            },
            success_url: `${YOUR_DOMAIN}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cart`,
        });

        // Send the session URL in a JSON response
        res.json({ url: session.url });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error creating checkout session");
    }
};

//Validate the session and create the order in the database
exports.successOrder = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId) {
            return res.status(400).send('Session ID is required');
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Check if the session is paid (you might want to check other statuses as well)
        if (session.payment_status === 'paid') {
            //Sends user to succes page
            res.render(path.join(__dirname, '..', 'views', 'order-approval.ejs'));
        } else {
            res.status(403).send('Invalid session ID');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
}