const router = require("express").Router();
const { adminStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");

router.get("/admin", protect, isCooperative, adminStats);

module.exports = router;
