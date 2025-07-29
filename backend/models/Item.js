const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  department: String,
  unit: String,
});

module.exports = mongoose.model("Item", itemSchema);