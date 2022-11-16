const express = require("express");
const { addToCart, getMyCart, deleteToCart } = require("../controller/cart");
const { authenticationToken } = require("../middleware");
const router = express.Router();

router.post("/", authenticationToken, addToCart);
router.get("/", authenticationToken, getMyCart);
router.delete("/:id", authenticationToken, deleteToCart);
// router.post("/login", login);
// router.post("/check-ongkir", checkOngkir);

module.exports = router;
