const Request = require("../models/Request");
const Quote = require("../models/Quote");
const Bill = require("../models/Bill");
const User = require("../models/User");

exports.adminStats = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const totalQuotes = await Quote.countDocuments();
    const totalBills = await Bill.countDocuments();
    const pendingUsers = await User.find({ isApproved: false });

    res.json({
      totalRequests,
      totalQuotes,
      totalBills,
      pendingUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading dashboard data" });
  }
};
