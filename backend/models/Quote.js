const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    // Human-readable request identifier like "2025/2506/0002"
    requestId: {
      type: String,
      required: true,
      trim: true,
    },

    // Array of quoted items with pricing and optional remarks
    items: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        remark: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    // Reference to the vendor submitting the quote
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Quote status tracked by admin
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Ensure each vendor can only submit one quote per request
quoteSchema.index({ request: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model("Quote", quoteSchema);
