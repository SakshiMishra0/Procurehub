const router = require("express").Router();
const {
  adminStats,
  recentRequests,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");

router.get("/admin-summary", protect, isCooperative, adminStats);
router.get("/requests", protect, isCooperative, recentRequests);

module.exports = router;
