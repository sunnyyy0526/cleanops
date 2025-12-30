const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// IMPORTANT: allow preflight
router.options("/register", (req, res) => res.sendStatus(200));
router.options("/login", (req, res) => res.sendStatus(200));

router.post("/register", register);
router.post("/login", login);

module.exports = router;