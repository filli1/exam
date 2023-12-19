//Define all routes for the products controller
const express = require("express");
const router = express.Router();
const products = require("../controllers/products.controllers");

router.post("/new", (req, res) => {
  return products.addProduct(req, res);
});

router.delete("/:id", (req, res) => {
  return products.deleteProduct(req, res);
});

router.get("/all", (req, res) => {
    return products.getAllProducts(req, res);
});

router.get("/:id", (req, res) => {
    return products.getoneProduct(req, res);
});


module.exports = router;