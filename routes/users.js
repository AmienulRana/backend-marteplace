const express = require("express");
const { register, login, checkOngkir } = require("../controller/users");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/check-ongkir", checkOngkir);

module.exports = router;
