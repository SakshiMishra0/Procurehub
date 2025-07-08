const User = require("../models/User");
const VendorItem = require("../models/VendorItem");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// Register New User
exports.register = async (req, res) => {
 const {
  name,
  email,
  password,
  role,
  note,
  organization,
  gstin,
  phone,
  address,
  vendorItems = [],
} = req.body;


  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  note,
  organization: role === "vendor" ? organization : undefined,
  gstin,
  phone,
  address,
  isApproved: false,
});


    if (role === "vendor" && Array.isArray(vendorItems)) {
      await Promise.all(
        vendorItems.map((item) =>
          VendorItem.create({
            vendor: user._id,
            name: item.name,
            description: item.description,
          })
        )
      );
    }

    await transporter.sendMail({
      to: process.env.COOP_EMAIL,
      subject: "🔐 New User Registration Pending",
      html: `
        <h3>${role.toUpperCase()} Registration</h3>
        <p><strong>Email:</strong> ${email}</p>
        ${
          role === "vendor"
            ? `
          <p><strong>Organization:</strong> ${organization}</p>
          <p><strong>GSTIN:</strong> ${gstin}</p>
          <p><strong>Items:</strong>
            <ul>${vendorItems
              .map((i) => `<li>${i.name}: ${i.description}</li>`)
              .join("")}</ul>
          </p>`
            : `<p><strong>Note:</strong> ${note}</p>`
        }
      `,
    });

    res.status(201).json({
      message: "Registration submitted. Await admin approval.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isApproved) {
      return res.status(401).json({ message: "Access denied" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

// ✅ Get All Pending Users (with Vendor Items)
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).lean();

    const enriched = await Promise.all(
      users.map(async (u) => {
        if (u.role === "vendor") {
          const items = await VendorItem.find({ vendor: u._id }).lean();
          return { ...u, vendorItems: items };
        }
        return u;
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Fetch pending users error:", err);
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

// Approve User
exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await transporter.sendMail({
      to: user.email,
      subject: "🎉 Your account is approved",
      html: `<p>You can now log in using:</p>
             <p><strong>Email:</strong> ${user.email}</p>
             <p><strong>Password:</strong> your set password</p>`,
    });

    res.status(200).json({ message: "User approved" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Approval error" });
  }
};

// Reject User
exports.rejectUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await VendorItem.deleteMany({ vendor: user._id }); // 🧹 cleanup vendor items

    await transporter.sendMail({
      to: user.email,
      subject: "❌ Registration Rejected",
      html: `<p>Sorry, your registration has been rejected. If you think this was a mistake, please contact the cooperative.</p>`,
    });

    res.status(200).json({ message: "User rejected and deleted" });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ message: "Rejection error" });
  }
};
