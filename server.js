require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.set('trust proxy', true);
app.use(express.json());

app.use(express.static('views'));
app.set('view engine', 'ejs');

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

//Set pages
app.get('/account', (req, res) => {
    res.render(__dirname + '/views/account.ejs');
})
app.get('/products', (req, res) => {
    res.render(__dirname + '/views/products.ejs');
})
// app.get('/order', (req, res) => {
//     res.render(__dirname + '/views/order.ejs');
// })
app.get('/cart', (req, res) => {
    res.render(__dirname + '/views/cart.ejs');
})
app.get('/create-user', (req, res) => {
    res.render(__dirname + '/views/create-user.ejs');
})

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

//Require Routes
const users = require('./routes/users.routes');
app.use('/users', users);
const products = require('./routes/products.routes');
app.use('/products', products);
const orders = require('./routes/orders.routes');
app.use('/orders', orders);