const mongoose = require("mongoose");

const vendorItemSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
});

module.exports = mongoose.model("VendorItem", vendorItemSchema);
