const router = require("express").Router();
const {
  register,
  login,
  approveUser,
  rejectUser,
  getPendingUsers,
  getApprovedUsers,
  getPendingUsersCount, // ✅ New controller
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Cooperative-only protected routes
router.get("/pending", protect, isCooperative, getPendingUsers);        // List all pending users
router.get("/approved", protect, isCooperative, getApprovedUsers);      // List all approved users
router.get("/pending/count", protect, isCooperative, getPendingUsersCount); // ✅ Count of pending users

router.put("/approve/:userId", protect, isCooperative, approveUser);    // Approve a user
router.delete("/reject/:userId", protect, isCooperative, rejectUser);   // Reject a user

module.exports = router;

