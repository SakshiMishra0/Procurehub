const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    requestId: {
      type: String,
      required: true,
      trim: true, 
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        name: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        uom: { type: String, required: true },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true },
        gstPercentage: { type: Number, required: true },
        gstAmount: { type: Number, required: true },
        netAmount: { type: Number, required: true },
        remark: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

quoteSchema.index({ request: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model("Quote", quoteSchema);
