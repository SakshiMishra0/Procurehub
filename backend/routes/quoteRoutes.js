const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");
const {
  submitQuote,
  getMyQuotes,
  getAllQuotes,
  approveQuote,
  rejectQuote,
  getQuotesByRequestId,
   getReceivedQuotes,
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

//Get quotes by requestId
router.get('/by-request/:requestId', quoteController.getQuotesByRequestId);

// Customer views all quotes received for their requests (vendor + admin)
router.get("/received", protect, getReceivedQuotes);


module.exports = router;
