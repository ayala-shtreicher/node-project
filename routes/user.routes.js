const express = require("express");
const authControllers = require("../controllers/authCntroller");
const userControllers = require("../controllers/user.controller");

const router = express.Router();

router.post("/register",userControllers.register);
router.post("/login",userControllers.login);
router.get("/:id",authControllers.authNoPermistion, userControllers.getUserById);

module.exports = router;
