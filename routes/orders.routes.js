const express = require('express');
const router = express.Router();

const orders = require('../controllers/orders.controllers');

router.post('/new', (req, res) => {
    return orders.newOrder(req, res);
});

router.get('/getUserOrder/:id', (req, res) => {
    return orders.getOrdersbyUser(req, res);
}); 

router.get('/retrieveSessions', (req, res) => {
    return orders.retrieveSessions(req, res);
})

router.post('/create-checkout-session', (req, res) => {
    return orders.createCheckoutSession(req, res);
})

router.get('/success', (req, res) => {
    return orders.successOrder(req, res);
})

router.get('/items/:sessionId', (req, res) => {
    return orders.getItemsInSession(req, res);
})   

module.exports = router;