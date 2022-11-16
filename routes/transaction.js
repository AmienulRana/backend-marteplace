const express = require("express");
const {
  addTransaction,
  getTransaction,
  getDetailTransaction,
  editStatusTransaction,
  getAllTransactionWithoutSelected,
} = require("../controller/transaction");
const { authenticationToken } = require("../middleware");
const router = express.Router();

router.post("/", authenticationToken, addTransaction);
router.get("/", authenticationToken, getTransaction);
router.get("/history", authenticationToken, getAllTransactionWithoutSelected);
router.get("/:id", authenticationToken, getDetailTransaction);
router.put("/:id", authenticationToken, editStatusTransaction);

module.exports = router;
