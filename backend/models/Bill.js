const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  quote: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalAmount: Number,
  commission: Number,
  note: { type: String }, // ✅ optional note
  generatedAt: { type: Date, default: Date.now },
});

// ✅ Only compile if not already compiled
module.exports = mongoose.models.Bill || mongoose.model("Bill", billSchema);
