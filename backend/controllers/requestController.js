const Request = require("../models/Request");
const User = require("../models/User");
const Quote = require("../models/Quote");
const nodemailer = require("nodemailer");
const generateRequestId = require("../utils/generateRequestId");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Email setup
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const recipients = Array.isArray(to) ? to.join(",") : to;
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "no-reply@procurehub.com",
      to: recipients,
      subject,
      text,
    });
    console.log(`📨 Email sent to: ${recipients}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

// Create Request by Customer
exports.createRequest = async (req, res) => {
  try {
    const { items, remarks = "", status = "pending" } = req.body;
    const customerId = req.user.id;

    const customer = await User.findById(customerId);
    if (!customer || customer.role !== "customer") {
      return res.status(403).json({ error: "Only customers can create requests." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required." });
    }

    const invalidItem = items.find(item =>
      !item.name || typeof item.name !== "string" ||
      typeof item.quantity !== "number" || item.quantity <= 0 ||
      !item.department || typeof item.department !== "string" ||
      (item.rate && typeof item.rate !== "number") ||
      (item.gst && typeof item.gst !== "number") ||
      (item.uom && typeof item.uom !== "string")
    );

    if (invalidItem) {
      return res.status(400).json({ error: "Invalid item format. Check all required fields." });
    }

    const requestCount = await Request.countDocuments({ originalRequestId: { $exists: false } });
    const requestId = await generateRequestId(requestCount);

    const newRequest = await Request.create({
      requestId,
      customer: customerId,
      items,
      remarks,
      status,
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ error: "Failed to create request." });
  }
};

// Approve & Split Request by Department
exports.approveRequest = async (req, res) => {
  try {
    const originalRequest = await Request.findById(req.params.id).populate("customer", "email name");
    if (!originalRequest) return res.status(404).json({ error: "Request not found." });

    const deptGroups = {};
    for (const item of originalRequest.items) {
      const dept = item.department.trim().toLowerCase();
      deptGroups[dept] = deptGroups[dept] || [];
      deptGroups[dept].push(item);
    }

    const createdSubRequests = [];

    for (const dept in deptGroups) {
      const items = deptGroups[dept];

      const vendors = await User.find({
        role: "vendor",
        department: new RegExp(`^${dept}$`, "i"),
        isApproved: true,
      });

      if (!vendors.length) continue;

      const vendorIds = vendors.map(v => v._id);
      const vendorEmails = vendors.map(v => v.email);

      const newRequestId = await generateRequestId(await Request.countDocuments(), dept);

      const newRequest = await Request.create({
        requestId: newRequestId,
        customer: originalRequest.customer._id,
        items,
        remarks: originalRequest.remarks,
        status: "published",
        visibleTo: vendorIds,
        originalRequestId: originalRequest._id,
      });

      createdSubRequests.push(newRequest);

      await sendEmail(
        vendorEmails,
        `New Procurement Request - ${dept} Department`,
        `A new procurement request is available. Login to ProcureHub to view and respond.`
      );
    }

    originalRequest.status = "published";
    await originalRequest.save();

    await sendEmail(
      originalRequest.customer.email,
      "Your Request Has Been Sent to Vendors",
      "Your procurement request was approved and split by department. Vendors have been notified."
    );

    res.status(200).json({
      message: "Request approved and split by department.",
      requests: createdSubRequests,
    });
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ error: "Failed to approve request." });
  }
};

// Get all customer requests (admin view)
exports.getCustomerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ originalRequestId: { $exists: false } })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching customer requests:", err);
    res.status(500).json({ error: "Failed to fetch customer requests." });
  }
};

// Get vendor-available requests
exports.getVendorRequests = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const quotedRequestIds = await Quote.find({ vendor: vendorId }).distinct("request");

    const availableRequests = await Request.find({
      status: "published",
      visibleTo: vendorId,
      _id: { $nin: quotedRequestIds },
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(availableRequests);
  } catch (err) {
    console.error("❌ Error fetching vendor requests:", err);
    res.status(500).json({ error: "Failed to fetch vendor requests." });
  }
};

// Reject Request
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: "Request not found." });

    res.status(200).json({ message: "Request rejected." });
  } catch (err) {
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request." });
  }
};

// Manually publish a request
exports.publishRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: "Request not found." });

    res.status(200).json({ message: "Request published manually." });
  } catch (err) {
    console.error("❌ Error publishing request:", err);
    res.status(500).json({ error: "Failed to publish request." });
  }
};

// Get requests of currently logged-in customer
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      customer: req.user.id,
      originalRequestId: { $exists: false },
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching my requests:", err);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("customer", "name email");
    if (!request) return res.status(404).json({ error: "Request not found." });
    res.status(200).json(request);
  } catch (err) {
    console.error("❌ Error fetching request:", err);
    res.status(500).json({ error: "Failed to fetch request." });
  }
};

// Get items for vendor by department
exports.getVendorItems = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id);
    const dept = vendor.department.trim().toLowerCase();

    const items = await Request.find({
      status: "published",
      "items.department": new RegExp(`^${dept}$`, "i"),
    }).select("items");

    const flatItems = items.flatMap(r =>
      r.items.filter(i => i.department.trim().toLowerCase() === dept)
    );

    res.status(200).json(flatItems);
  } catch (err) {
    console.error("❌ Error fetching vendor items:", err);
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

// Get all published split requests (admin view)
exports.getPublishedSplitRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      originalRequestId: { $exists: true },
      status: "published",
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching published split requests:", err);
    res.status(500).json({ error: "Failed to fetch vendor requests." });
  }
};

// Admin Uploads Quote (PDF/DOC/Image)
exports.uploadAdminQuote = async (req, res) => {
  try {
    const { requestId } = req.body;
    const filePath = req.file?.path;

    const request = await Request.findById(requestId).populate("customer", "email name");
    if (!request) return res.status(404).json({ error: "Request not found." });

    request.adminQuoteFile = filePath;
    request.status = "quote_uploaded_by_admin";
    await request.save();

    await sendEmail(
      request.customer.email,
      "Quote Uploaded for Your Request",
      `A quote has been uploaded for your request ID: ${request.requestId}. Login to download it.`
    );

    res.status(200).json({ message: "Quote uploaded successfully and customer notified." });
  } catch (err) {
    console.error("❌ Error uploading admin quote:", err);
    res.status(500).json({ error: "Failed to upload quote." });
  }
};

// Multer Setup for Admin Quote Upload
const quoteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/quotes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString().slice(2)}${path.extname(file.originalname)}`);
  },
});

const uploadAdminQuote = multer({ storage: quoteStorage });
module.exports.uploadAdminQuoteMiddleware = uploadAdminQuote.single("adminQuoteFile");
