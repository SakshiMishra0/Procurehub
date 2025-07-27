const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    uom: { type: String, default: "pcs" },
    department: { type: String, required: true,},               
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [itemSchema],
      validate: [(arr) => arr.length > 0, "At least one item required."],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "approved", "billed"],
      default: "draft",
    },
    remarks: {
      type: String,
      trim: true,
    },
    visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    originalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    sentTo : [{type: mongoose.Schema.Types.ObjectId, ref:"user"}]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
