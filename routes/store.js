const express = require("express");
const { editStore, getStore } = require("../controller/store");
const { authenticationToken } = require("../middleware");
const router = express.Router();

router.put("/", authenticationToken, editStore);
router.get("/", authenticationToken, getStore);

module.exports = router;
