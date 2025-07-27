const Request = require("../models/Request");
const User = require("../models/User");
const Quote = require("../models/Quote");
const nodemailer = require("nodemailer");
const generateRequestId = require("../utils/generateRequestId");

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const recipients = Array.isArray(to) ? to.join(",") : to;
  try {
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

    const invalidItem = items.find((item) =>
      !item.name || typeof item.name !== "string" ||
      typeof item.quantity !== "number" || item.quantity <= 0 ||
      !item.department || typeof item.department !== "string" ||
      (item.rate && typeof item.rate !== "number") ||
      (item.gst && typeof item.gst !== "number") ||
      (item.uom && typeof item.uom !== "string")
    );

    if (invalidItem) {
      return res.status(400).json({ error: "Invalid item format. Ensure all required fields are provided correctly." });
    }

    const requestCount = await Request.countDocuments({ originalRequestId: { $exists: false } });
    const requestId = await generateRequestId(requestCount);

    const newRequest = new Request({
      requestId,
      customer: customerId,
      items,
      remarks,
      status,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("❌ Error creating request:", error);
    res.status(500).json({ error: "Failed to create request." });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const originalRequest = await Request.findById(req.params.id).populate("customer", "email name");
    if (!originalRequest) return res.status(404).json({ error: "Request not found." });

    const deptGroups = {};
    for (const item of originalRequest.items) {
      const dept = item.department.trim().toLowerCase();
      if (!deptGroups[dept]) deptGroups[dept] = [];
      deptGroups[dept].push(item);
    }

    const createdSubRequests = [];

    for (const dept in deptGroups) {
      const departmentCode = dept;
      const items = deptGroups[dept];

      const vendors = await User.find({
        role: "vendor",
        department: { $regex: new RegExp(`^${dept}$`, 'i') },
        isApproved: true,
      });

      if (!vendors.length) continue;

      const vendorIds = vendors.map(v => v._id);
      const vendorEmails = vendors.map(v => v.email);

      const newRequestId = await generateRequestId(await Request.countDocuments(), departmentCode);

      const newRequest = new Request({
        requestId: newRequestId,
        customer: originalRequest.customer._id,
        items,
        remarks: originalRequest.remarks,
        status: "published",
        visibleTo: vendorIds,
        originalRequestId: originalRequest._id,
      });

      await newRequest.save();
      createdSubRequests.push(newRequest);

      await sendEmail(
        vendorEmails,
        `New Request: ${dept} Department`,
        `A new procurement request for ${dept} items is available. Log in to respond.`
      );
    }

    originalRequest.status = "published";
    await originalRequest.save();

    await sendEmail(
      originalRequest.customer.email,
      "Request published and sent to vendors",
      "Your procurement request has been split and sent to vendors by department. You can now monitor vendor response."
    );

    res.status(200).json({
      message: "Request approved and split by department.",
      requests: createdSubRequests,
    });
  } catch (error) {
    console.error("❌ Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request." });
  }
};

exports.getCustomerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ originalRequestId: { $exists: false } })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching customer requests:", err);
    res.status(500).json({ error: "Failed to fetch customer requests" });
  }
};

exports.getVendorRequests = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const quoted = await Quote.find({ vendor: vendorId }).select("request");
    const quotedRequestIds = quoted.map(q => q.request.toString());

    const availableRequests = await Request.find({
      status: "published",
      visibleTo: vendorId,
      _id: { $nin: quotedRequestIds },
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(availableRequests);
  } catch (error) {
    console.error("❌ Error fetching vendor requests:", error);
    res.status(500).json({ error: "Failed to fetch vendor requests." });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found." });

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Request rejected." });
  } catch (error) {
    console.error("❌ Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request." });
  }
};

exports.publishRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found." });

    request.status = "published";
    await request.save();

    res.status(200).json({ message: "Request published manually." });
  } catch (error) {
    console.error("❌ Error publishing request:", error);
    res.status(500).json({ error: "Failed to publish request." });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.user.id, originalRequestId: { $exists: false } })
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching my requests:", error);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("customer", "name email");
    if (!request) return res.status(404).json({ error: "Request not found." });
    res.status(200).json(request);
  } catch (error) {
    console.error("❌ Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request." });
  }
};

exports.getVendorItems = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id);
    const dept = vendor.department.trim().toLowerCase();

    const items = await Request.find({
      status: "published",
      "items.department": { $regex: new RegExp(`^${dept}$`, 'i') },
    }).select("items");

    const flatItems = items.flatMap(r => r.items.filter(i => i.department.trim().toLowerCase() === dept));
    res.status(200).json(flatItems);
  } catch (error) {
    console.error("❌ Error fetching vendor items:", error);
    res.status(500).json({ error: "Failed to fetch items." });
  }
};

exports.getPublishedSplitRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      originalRequestId: { $exists: true },
      status: "published"
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching published split requests:", error);
    res.status(500).json({ error: "Failed to fetch vendor requests." });
  }
};
