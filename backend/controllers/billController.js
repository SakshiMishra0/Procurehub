const Bill = require("../models/Bill");

exports.getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills" });
  }
};
