const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    requestId: {
      type: String, // Human-readable ID (e.g., 2025/2506/0002)
      required: true,
    },
    item: {
      name: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    remark: {
      type: String,
      default: "",
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
