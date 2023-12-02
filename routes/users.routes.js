const express = require("express");
const router = express.Router();

const users = require("../controllers/users.controllers");

router.get("/f/:id", (req, res) => {
  return users.getUserReq(req, res);
});

router.post("/login", (req, res) => {
    return users.login(req, res);
});

router.post("/create", (req, res) => {
  return users.createUser(req, res);
});

router.put("/:id", (req, res) => {
  return users.editUser(req, res);
});

router.delete("/:id", (req, res) => {
  return users.deleteUser(req, res);
});

router.post("/email", (req, res) => {
  return users.getUserByEmail(req, res);
});  

router.post("/check", (req, res) => {
  return users.checkUserByEmail(req, res);
})

module.exports = router;