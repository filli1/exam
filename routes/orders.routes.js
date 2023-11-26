const express = require('express');
const router = express.Router();

const orders = require('../controllers/orders.controllers');

router.post('/new', (req, res) => {
    return orders.newOrder(req, res);
});

router.get('/:id', (req, res) => {
    return orders.getOrdersbyUser(req, res);
}); 

module.exports = router;