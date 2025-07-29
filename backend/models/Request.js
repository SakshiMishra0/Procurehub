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
      enum: [ "pending",  "approved","rejected", "published","quote_uploaded_by_admin", "billed"],
      default: "pending",
    },
    remarks: {
      type: String,
      trim: true,
    },
    adminQuoteFile: {
        type: String,
    },
    
    visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    originalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    sentTo : [{type: mongoose.Schema.Types.ObjectId, ref:"user"}],
   
     adminQuoteFile: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
