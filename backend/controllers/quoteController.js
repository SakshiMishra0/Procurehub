const Quote = require("../models/Quote");
const Request = require("../models/Request");
const transporter = require("../config/mailer");

// ✅ Vendor submits a quote for all items of a request
exports.submitQuote = async (req, res) => {
  try {
    const { items } = req.body; // [{ name, price, remark }]
    const { requestId } = req.params;
    const vendorId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required." });
    }

    for (const item of items) {
      if (!item.name || isNaN(item.quantity) || !item.uom || isNaN(item.rate) || isNaN(item.gstPercentage)) {
        return res.status(400).json({ message: "Each item must have all required fields: itemName, quantity, unit, pricePerUnit, and gstPercentage.", });
      }
    }

    const request = await Request.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Validate all quoted item names exist in the request
    const requestItemNames = request.items.map(i => i.name);
    const invalidItems = items.filter(item => !requestItemNames.includes(item.name));

    if (invalidItems.length > 0) {
      return res.status(400).json({ message: "One or more quoted items do not exist in the request." });
    }

    // Check if a quote already exists for this vendor and request
    const existingQuote = await Quote.findOne({ request: request._id, vendor: vendorId });
    if (existingQuote) {
      return res.status(400).json({ message: "You have already submitted a quote for this request." });
    }

    const quote = await Quote.create({
      request: request._id,
      requestId: request.requestId,
      items: items, // Correct key from schema
      vendor: vendorId,
      status: "pending"
    });

    // Optional: link quote back to request
    await Request.findByIdAndUpdate(request._id, {
      $push: { quotes: quote._id },
    });

    // 📧 Email Notification
    const itemListHtml = items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join("");

    await transporter.sendMail({
      to: process.env.COOP_EMAIL,
      subject: "📝 New Quote Submitted",
      html: `
        <h3>New Quote Submitted</h3>
        <p><strong>Request ID:</strong> ${request.requestId}</p>
        <ul>${itemListHtml}</ul>
        <p><strong>Vendor:</strong> ${req.user.email}</p>
      `,
    });

    return res.status(201).json(quote);
  } catch (err) {
    console.error("❌ Error submitting quote:", err);
    return res.status(500).json({ message: "Error while submitting quote." });
  }
};

// ✅ Get vendor's submitted quotes
exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ vendor: req.user._id })
      .populate("request")
      .sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (err) {
    console.error("❌ Fetch My Quotes Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: Get all quotes
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate("request vendor")
      .sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (err) {
    console.error("❌ Fetch All Quotes Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Approve a single quote & reject others of same request
exports.approveQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id).populate("request");
    if (!quote) return res.status(404).json({ message: "Quote not found" });

    quote.status = "approved";
    await quote.save();

    await Quote.updateMany(
      { request: quote.request._id, _id: { $ne: quote._id } },
      { $set: { status: "rejected" } }
    );

    res.status(200).json({ message: "Quote approved" });
  } catch (err) {
    console.error("❌ Approve Quote Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reject a single quote
exports.rejectQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    if (!quote) return res.status(404).json({ message: "Quote not found" });

    quote.status = "rejected";
    await quote.save();

    res.status(200).json({ message: "Quote rejected" });
  } catch (err) {
    console.error("❌ Reject Quote Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
