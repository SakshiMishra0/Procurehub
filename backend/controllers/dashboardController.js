const Request = require("../models/Request");
const Quote = require("../models/Quote");
const Bill = require("../models/Bill");
const User = require("../models/User");

// 🔹 Get dashboard summary stats
exports.adminStats = async (req, res) => {
  try {
    const [requestsCount, quotesCount, billsCount, todayRegistrations, pendingApprovals] =
      await Promise.all([
        Request.countDocuments(),
        Quote.countDocuments(),
        Bill.countDocuments(),
        User.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
        User.countDocuments({ isApproved: false }),
      ]);

    res.json({
      requests: requestsCount,
      quotes: quotesCount,
      bills: billsCount,
      newRegistrations: todayRegistrations,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    res.status(500).json({ message: "Error loading dashboard data" });
  }
};

// 🔹 Get recent requests with optional date filtering
exports.recentRequests = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const status = req.query.status; // e.g., ?status=pending

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const query = {
      createdAt: { $gte: fromDate },
    };

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Recent requests error:", error.message);
    res.status(500).json({ message: "Error fetching recent requests" });
  }
};
