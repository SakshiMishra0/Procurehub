const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["customer", "vendor", "cooperative"] },
    department: { type: String },
    isApproved: { type: Boolean, default: false },
    organization: String,
    gstin: String,
    phone: String,
    address: {
      permanent: String,
      shipping: String,
    },
    note: String,
  },
  { timestamps: true } // ✅ This adds createdAt and updatedAt automatically
);


module.exports = mongoose.model("User", userSchema);
