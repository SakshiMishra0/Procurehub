const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getVendorItems,
  getCustomerRequests,
  getVendorRequests,
  publishRequest,
  getRequestById,
  approveRequest,
  rejectRequest,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

// ==============================
// 🔐 All Routes Are Protected
// ==============================

// 🔸 Customer: Create a new request
router.post("/", protect, createRequest);

// 🔸 Customer: View their own requests
router.get("/mine", protect, getMyRequests);

// 🔸 Customer: View available vendor items
router.get("/vendor-items", protect, getVendorItems);

// 🔸 Cooperative Admin: View customer-submitted (received) requests
router.get("/customer-requests", protect, getCustomerRequests);

// 🔸 Cooperative Admin: View requests published for vendors
router.get("/vendor-requests", protect, getVendorRequests);

// 🔸 Cooperative Admin: Publish a request (make it visible to vendors)
router.put("/publish/:id", protect, publishRequest);

// 🔸 Cooperative Admin: Approve a customer's request
router.put("/approve/:id", protect, approveRequest);

// 🔸 Cooperative Admin: Reject a customer's request
router.put("/reject/:id", protect, rejectRequest);

// 🔸 Get a single request by ID (should be placed at the end)
router.get("/:id", protect, getRequestById);

module.exports = router;
