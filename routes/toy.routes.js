const express = require("express");
const toyCntrollers = require("../controllers/toy.controller");
const authController = require("../controllers/authCntroller");
const router = express.Router();


router.get("/", toyCntrollers.getToys)
router.get("/getAll", toyCntrollers.getAllToys)
router.get("/search", authController.authNoPermistion, toyCntrollers.getToysSearch)
router.get("/category/:category", authController.authNoPermistion, toyCntrollers.getToyByCategory)
router.get("/single/:id", authController.authNoPermistion, toyCntrollers.getToyById)
router.post("/", authController.authNoPermistion, toyCntrollers.addNewToy)
router.patch("/:id", authController.authNoPermistion, toyCntrollers.updateToy);
router.delete("/:id", authController.authNoPermistion, toyCntrollers.deleteToy);

module.exports = router;