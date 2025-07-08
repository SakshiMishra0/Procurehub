const router = require("express").Router();
const { getMyBills } = require("../controllers/billController");
const { protect } = require("../middleware/authMiddleware");

router.get("/mine", protect, getMyBills);

module.exports = router;
