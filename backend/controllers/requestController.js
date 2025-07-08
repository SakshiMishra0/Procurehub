const User = require("../models/User");
const Request = require("../models/Request");
const generateRequestId = require("../utils/generateRequestId");
const transporter = require("../config/mailer");
const VendorItem = require("../models/VendorItem");

exports.createRequest = async (req, res) => {
  try {
    const { items, remarks, isDraft } = req.body;
    const customerId = req.user.id;

    const reqCount = await Request.countDocuments();
    const requestId = generateRequestId(reqCount + 1);

    const newRequest = await Request.create({
      requestId,
      customer: customerId,
      items,
      remarks,
      status: isDraft ? "draft" : "pending", // 'pending' means waiting for cooperative review
    });

    // Notify cooperative only if not draft
    if (!isDraft) {
      await transporter.sendMail({
        to: process.env.COOP_EMAIL,
        subject: "📢 New Request Pending Review",
        html: `<p>Request ID: ${requestId}</p><p>Customer: ${req.user.email}</p>`,
      });
    }

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ message: "Error creating request" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

exports.getVendorItems = async (req, res) => {
  try {
    const items = await VendorItem.find().distinct("name");
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching vendor items:", err);
    res.status(500).json({ message: "Failed to load vendor items" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("customer")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching all requests:", err);
    res.status(500).json({ message: "Error fetching all requests" });
  }
};

exports.getPublishedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "published" }).populate(
      "customer"
    );
    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching published requests:", err);
    res.status(500).json({ message: "Error fetching published requests" });
  }
};

exports.publishRequest = async (req, res) => {
  try {
    if (req.user.role !== "cooperative") {
      return res
        .status(403)
        .json({ message: "Only cooperative can publish requests" });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    ).populate("customer");

    if (!request) return res.status(404).json({ message: "Request not found" });

    const vendors = await User.find({ role: "vendor" });

    for (let vendor of vendors) {
      await transporter.sendMail({
        to: vendor.email,
        subject: "📢 New Request Available",
        html: `<p>Hello Vendor,</p>
               <p>A new request (<strong>${request.requestId}</strong>) has been published.</p>
               <p>Customer: ${request.customer.email}</p>`,
      });
    }

    res.json(request);
  } catch (err) {
    console.error("❌ Error publishing request:", err);
    res.status(500).json({ message: "Failed to publish request" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("customer");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error("❌ Error fetching request by ID:", err);
    res.status(500).json({ message: "Error fetching request" });
  }
};
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

