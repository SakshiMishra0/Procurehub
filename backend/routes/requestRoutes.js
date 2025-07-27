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
  getPublishedSplitRequests,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

// Routes below require login
router.post("/", protect, createRequest);                         // Create request (Customer)
router.get("/mine", protect, getMyRequests);                      // Customer's requests
router.get("/vendor-items", protect, getVendorItems);             // Vendor item list

router.get("/customer-requests", protect, getCustomerRequests);   // Admin: received requests
router.get("/published-splits", protect, getPublishedSplitRequests); // Admin: sent-to-vendor
router.get("/vendor-requests", protect, getVendorRequests);       // Vendor: published requests

router.get("/admin/requests", async (req, res) => {
  try {
    const requests = await Request.find().populate("customer");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
router.put("/publish/:id", protect, publishRequest);              // Admin: manual publish
router.put("/approve/:id", protect, approveRequest);              // Admin: approve request
router.put("/reject/:id", protect, rejectRequest);                // Admin: reject request

router.get("/:id", protect, getRequestById);                      // View single request (always last)

module.exports = router;
