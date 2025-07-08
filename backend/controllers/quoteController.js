const Quote = require("../models/Quote");
const Request = require("../models/Request");
const transporter = require("../config/mailer");

// Submit a quote for a request item
exports.submitQuote = async (req, res) => {
  try {
    const { itemName, price, remark } = req.body;
    const { requestId } = req.params;
    const vendorId = req.user.id;

    if (!itemName || !price) {
      return res
        .status(400)
        .json({ message: "Item name and price are required." });
    }

    const request = await Request.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Prevent duplicate quote for same item by same vendor
    const alreadyQuoted = await Quote.findOne({
      request: request._id,
      vendor: vendorId,
      "item.name": itemName,
    });

    if (alreadyQuoted) {
      return res
        .status(409)
        .json({ message: "Quote already submitted for this item." });
    }

    const quote = await Quote.create({
      request: request._id,
      requestId: request.requestId,
      item: { name: itemName },
      price,
      remark,
      vendor: vendorId,
      status: "pending",
    });

    // Optional: Store quote reference in request
    await Request.findByIdAndUpdate(request._id, {
      $push: { quotes: quote._id },
    });

    // Notify cooperative
    await transporter.sendMail({
      to: process.env.COOP_EMAIL,
      subject: "💰 New Quote Submitted",
      html: `
        <p><strong>Request ID:</strong> ${request.requestId}</p>
        <p><strong>Item:</strong> ${itemName}</p>
        <p><strong>Price:</strong> ₹${price}</p>
        <p><strong>Vendor:</strong> ${req.user.email}</p>
      `,
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error("❌ Error in submitQuote:", err);
    res.status(500).json({ message: "Error submitting quote." });
  }
};

// Get all quotes submitted by current vendor
exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ vendor: req.user.id })
      .populate("request", "requestId")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    console.error("❌ Error fetching vendor quotes:", err);
    res.status(500).json({ message: "Error fetching your quotes." });
  }
};

// Get all quotes (for cooperative/admin)
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate("vendor", "name email")
      .populate("request", "requestId items")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    console.error("❌ Error in getAllQuotes:", err);
    res.status(500).json({ message: "Error fetching all quotes." });
  }
};

// Approve a quote
exports.approveQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res.json(quote);
  } catch (err) {
    console.error("❌ Error approving quote:", err);
    res.status(500).json({ message: "Error approving quote." });
  }
};

// Reject a quote
exports.rejectQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res.json(quote);
  } catch (err) {
    console.error("❌ Error rejecting quote:", err);
    res.status(500).json({ message: "Error rejecting quote." });
  }
};
