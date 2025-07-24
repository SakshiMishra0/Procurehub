const express = require("express");
const router = express.Router();
const {
  submitQuote,
  getMyQuotes,
  getAllQuotes,
  approveQuote,
  rejectQuote,
} = require("../controllers/quoteController");
const { protect } = require("../middleware/authMiddleware");

// Vendor submits quote
router.post("/:requestId", protect, submitQuote);

// Vendor views own quotes
router.get("/mine", protect, getMyQuotes);

// Cooperative views all quotes
router.get("/all", protect, getAllQuotes);

// Cooperative approves a quote
router.put("/approve/:id", protect, approveQuote);

// Cooperative rejects a quote
router.put("/reject/:id", protect, rejectQuote);

module.exports = router;
