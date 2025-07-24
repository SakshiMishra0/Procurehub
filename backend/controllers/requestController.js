const Request = require("../models/Request");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ============================
// 📧 Utility: Send Email
// ============================
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const recipients = Array.isArray(to) ? to.join(",") : to;

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@procurehub.com",
    to: recipients,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to: ${recipients}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

// ============================
// 📥 Create Request (Customer)
// ============================
// exports.createRequest = async (req, res) => {
//   try {
//     const { items, status = "pending" } = req.body;
//     const customerId = req.user.id;

//     const customer = await User.findById(customerId);
//     if (!customer || customer.role !== "customer") {
//       return res.status(403).json({ error: "Only customers can create requests." });
//     }

//     const newRequest = new Request({
//       customer: customerId,
//       items,
//       status,
//     });

//     await newRequest.save();
//     res.status(201).json(newRequest);
//   } catch (error) {
//     console.error("❌ Error creating request:", error);
//     res.status(500).json({ error: "Failed to create request." });
//   }
// };

const generateRequestId = async () => {
  const count = await Request.countDocuments();
  const paddedNumber = (count + 1).toString().padStart(4, "0");
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `REQ-${today}-${paddedNumber}`;
};

exports.createRequest = async (req, res) => {
  try {
    const { items, status = "pending" } = req.body;
    const customerId = req.user.id;

    const customer = await User.findById(customerId);
    if (!customer || customer.role !== "customer") {
      return res.status(403).json({ error: "Only customers can create requests." });
    }

    const requestId = await generateRequestId();

    const newRequest = new Request({
      requestId,           // 🆕 required field
      customer: customerId,
      items,
      status,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("❌ Error creating request:", error);
    res.status(500).json({ error: "Failed to create request." });
  }
};


// ============================
// 📄 Get Requests by Customer (For Admin)
// ============================
exports.getCustomerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: { $nin: ["draft"] } })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching customer requests:", error);
    res.status(500).json({ error: "Failed to fetch customer requests." });
  }
};

// ============================
// 📤 Get Published Requests (For Vendors)
// ============================
exports.getVendorRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "published" })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching vendor requests:", error);
    res.status(500).json({ error: "Failed to fetch vendor requests." });
  }
};

// ============================
// ✅ Approve Request (Auto-Publish)
// ============================
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("customer", "email");
    if (!request) return res.status(404).json({ error: "Request not found." });

    request.status = "published";
    await request.save();

    // Notify Customer
    await sendEmail(
      request.customer.email,
      "Request Approved",
      "Your request has been approved and published for vendors to view."
    );

    // Notify Vendors
    const vendors = await User.find({ role: "vendor" });
    const vendorEmails = vendors.map((vendor) => vendor.email);

    if (vendorEmails.length > 0) {
      await sendEmail(
        vendorEmails,
        "New Request Published",
        "A new procurement request has been published. Please login to view and respond."
      );
    }

    res.status(200).json({ message: "Request approved and published.", request });
  } catch (error) {
    console.error("❌ Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request." });
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

    if (!request) return res.status(404).json({ error: "Request not found." });

    await sendEmail(
      request.customer.email,
      "Request Rejected",
      "Your procurement request has been rejected by the cooperative."
    );

    res.status(200).json({ message: "Request rejected.", request });
  } catch (error) {
    console.error("❌ Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request." });
  }
};

// ============================
// 🟡 Manually Publish Request (Admin)
// ============================
exports.publishRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    ).populate("customer", "email");

    if (!request) return res.status(404).json({ error: "Request not found." });

    // Notify Customer
    await sendEmail(
      request.customer.email,
      "Request Published",
      "Your request has been manually published to vendors."
    );

    // Notify Vendors
    const vendors = await User.find({ role: "vendor" });
    const vendorEmails = vendors.map((vendor) => vendor.email);

    if (vendorEmails.length > 0) {
      await sendEmail(
        vendorEmails,
        "New Request Published",
        "A new procurement request has been published. Please login to view and respond."
      );
    }

    res.status(200).json({ message: "Request published.", request });
  } catch (error) {
    console.error("❌ Error publishing request:", error);
    res.status(500).json({ error: "Failed to publish request." });
  }
};

// ============================
// 🔍 Get My Requests (Customer Dashboard)
// ============================
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Request.find({ customer: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching my requests:", error);
    res.status(500).json({ error: "Failed to fetch your requests." });
  }
};

// ============================
// 📦 Get Request by ID
// ============================
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("customer", "name email");

    if (!request) return res.status(404).json({ error: "Request not found." });

    res.status(200).json(request);
  } catch (error) {
    console.error("❌ Error fetching request by ID:", error);
    res.status(500).json({ error: "Failed to fetch request." });
  }
};

// ============================
// 🛠️ Get Vendor Items (Optional Placeholder)
// ============================
exports.getVendorItems = async (req, res) => {
  try {
    // Placeholder for vendor item retrieval logic
    res.status(200).json({ message: "Vendor item list logic not implemented." });
  } catch (error) {
    console.error("❌ Error fetching vendor items:", error);
    res.status(500).json({ error: "Failed to fetch vendor items." });
  }
};
