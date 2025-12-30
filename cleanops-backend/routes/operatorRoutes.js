const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createOperator,
  getOperators,
} = require("../controllers/operatorController");

router.get("/", authMiddleware, getOperators);
router.post("/", authMiddleware, createOperator);

module.exports = router;

