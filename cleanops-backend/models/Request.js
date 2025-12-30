const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const requestSchema = new mongoose.Schema(
  {
    ticketId: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: String,
    mobile: String,

    ward: String,
    wasteType: String,
    timeSlot: String,
    address: String,
    latitude: String,
    longitude: String,
    description: String,

    status: {
      type: String,
      enum: ["Open", "Assigned", "In Progress", "On the way", "Completed", "Rejected"],
      default: "Open",
    },

    assignedOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
    },

    photos: {
      type: [String],
      default: [],
    },

    notes: [noteSchema],
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
