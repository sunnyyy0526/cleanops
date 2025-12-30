const Operator = require("../models/Operator");

/* CREATE OPERATOR */
exports.createOperator = async (req, res) => {
  try {
    const operator = await Operator.create({
      user: req.user._id,   // 🔥 REQUIRED
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      ward: String(req.body.ward),
    });

    res.status(201).json(operator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* GET OPERATORS */
exports.getOperators = async (req, res) => {
  const operators = await Operator.find().sort({ createdAt: -1 });
  res.json(operators);
};
