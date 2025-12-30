const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    phone: String,
    ward: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Operator", operatorSchema);
