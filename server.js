const express = require('express');
const app = express();
const port = 3000;

app.set('trust proxy', true);
app.use(express.json());

app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

//Set pages
app.get('/account', (req, res) => {
    res.sendFile(__dirname + '/views/account.html');
})
app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/views/products.html');
})
app.get('/order', (req, res) => {
    res.sendFile(__dirname + '/views/order.html');
})
app.get('/cart', (req, res) => {
    res.sendFile(__dirname + '/views/cart.html');
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