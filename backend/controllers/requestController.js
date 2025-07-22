const Request = require("../models/Request");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ============================
// 📥 Create Request
// ============================
exports.createRequest = async (req, res) => {
  try {
    const { items, status = "pending" } = req.body;
    const customerId = req.user.id;

    const customer = await User.findById(customerId);
    if (!customer || customer.role !== "customer") {
      return res.status(403).json({ error: "Only customers can create requests" });
    }

    const newRequest = new Request({
      customer: customerId,
      items,
      status,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("❌ Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
};

// ============================
// 📄 Get All Customer Requests (Received Tab)
// ============================
exports.getCustomerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: { $ne: "draft" } })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching customer requests:", error);
    res.status(500).json({ error: "Failed to fetch customer requests" });
  }
};

// ============================
// 🚚 Get All Vendor Requests (Sent Tab)
// ============================
exports.getVendorRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "published" })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching vendor requests:", error);
    res.status(500).json({ error: "Failed to fetch vendor requests" });
  }
};

// ============================
// ✅ Approve Request
// ============================
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("customer", "email");

    if (!request) return res.status(404).json({ error: "Request not found" });

    await sendEmail(request.customer.email, "Request Approved", "Your request has been approved.");
    res.status(200).json({ message: "Request approved", request });
  } catch (error) {
    console.error("❌ Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

// ============================
// ❌ Reject Request
// ============================
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("customer", "email");

    if (!request) return res.status(404).json({ error: "Request not found" });

    await sendEmail(request.customer.email, "Request Rejected", "Your request has been rejected.");
    res.status(200).json({ message: "Request rejected", request });
  } catch (error) {
    console.error("❌ Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// ============================
// 📢 Publish Request
// ============================
exports.publishRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    ).populate("customer", "email");

    if (!request) return res.status(404).json({ error: "Request not found" });

    await sendEmail(request.customer.email, "Request Published", "Your request has been published to vendors.");
    res.status(200).json({ message: "Request published", request });
  } catch (error) {
    console.error("❌ Error publishing request:", error);
    res.status(500).json({ error: "Failed to publish request" });
  }
};

// ============================
// 📧 Email Utility
// ============================
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@procurehub.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};
