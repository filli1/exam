const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const usersController = require('./users.controllers');
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

exports.retrieveSessions = async (req, res) => {
    const userAuth = JSON.parse(req.cookies.userAuth);
    try {
        const sessions = await stripe.checkout.sessions.list({
            customer: userAuth.stripeID,
        });
        const orders = sessions.data.map(session => {
            return {
                id: session.id,
                payment_status: session.payment_status,
                amount_total: session.amount_total/100,
                customer: session.customer,
            }
        });
        res.status(200).send(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error retrieving sessions");
    }
}

exports.retrieveSessionLineItems = async (session) => {
    const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
    );
    return lineItems;
}

const YOUR_DOMAIN = `https://joetogo.dk`;

exports.createCheckoutSession = async (req, res) => {
    const userAuth = JSON.parse(req.cookies.userAuth);

    try {
        const user = await usersController.getUser(userAuth.id);

        const session = await stripe.checkout.sessions.create({
            line_items: req.body,
            mode: 'payment',
            custom_text: {
                submit: {
                  message: 'You\'ll get an email with your order confirmation, and a SMS when your order is ready for pickup.',
                },
            },
            phone_number_collection: {
                enabled: true,
            },
            customer: userAuth.stripeID,
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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "cbsdisex@gmail.com",
      pass: process.env.GMAIL_API_KEY,
    },
  });

async function mailToUser(subject, text, html, recipients = []) {
    const info = await transporter.sendMail({
        from: "JOE <cbsdisex@gmail.com>", // sender address
        to: recipients, // list of reciever addresses
        subject: subject, // subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
}

function createItemHtml(item) {
    return `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.price / 100).toFixed(2)} DKK</td>
        </tr>
    `;
}


//Validate the session and create the order in the database
exports.successOrder = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId) {
            return res.status(400).send('Session ID is required');
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const email = session.customer_details.email;
        const name = session.customer_details.name;
        const phone = session.customer_details.phone;
        
        // Check if the session is paid (you might want to check other statuses as well)
        if (session.payment_status === 'paid') {
            // get the line items from the session
            const lineItems = await exports.retrieveSessionLineItems(session);
            const orderItems = lineItems.data.map(item => {
                return {
                    productName: item.description,
                    quantity: item.quantity,
                    price: item.amount_total,
                }
            });
            // Put together the HTML for the Items to the email
            const itemsHtml = orderItems.map(createItemHtml).join('');

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Order Confirmation</title>
                </head>
                <body>
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h1 style="background-color: rgba(247, 193, 217, 1); color: white; padding: 10px; text-align: center;">
                            Order Confirmation
                        </h1>
                        <p>Hi ${name},</p>
                        <p>Your order is confirmed. You'll get an SMS when your order is ready for pickup.</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
                            </tr>
                            ${itemsHtml}
                        </table>
                        <p style="text-align: center;">Thank you for shopping with us!</p>
                    </div>
                </body>
                </html>
                `;

            //Sends user confirmation mail
            mailToUser("Order confirmation", '', htmlContent, [email])
            //Sends user SMS in 2 minutes
            setTimeout(() => {
                sendSMS(phone);
            }, 2 * 60 * 1000)
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

//This function uses the twilio package to send an SMS to the user
function sendSMS(phoneNumber, name) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: `Hey ${name}! Your JOE order is ready for pickup!`,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            from: '+1 914 425 5822',
            to: phoneNumber,
        })
        .then(message => console.log(message.sid));
}