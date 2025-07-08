const router = require("express").Router();
const {
  register,
  login,
  approveUser,
  rejectUser,
  getPendingUsers, // ✅ New controller
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

// Cooperative-only protected routes
router.get("/pending", protect, isCooperative, getPendingUsers); // ✅ List pending
router.put("/approve/:userId", protect, isCooperative, approveUser);
router.delete("/reject/:userId", protect, isCooperative, rejectUser); // ✅ Reject

module.exports = router;
