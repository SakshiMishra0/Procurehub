const User = require("../models/User");
const VendorItem = require("../models/VendorItem");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// ========================================
// 📌 REGISTER NEW USER (Vendor or Customer)
// ========================================
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
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      note: role === "customer" ? note : undefined,
      organization: role === "vendor" ? organization : undefined,
      gstin,
      phone,
      address,
      isApproved: false,
    });

    // Save vendor items
    if (role === "vendor" && Array.isArray(vendorItems)) {
      await VendorItem.insertMany(
        vendorItems.map((item) => ({
          vendor: newUser._id,
          name: item.name,
          description: item.description,
        }))
      );
    }

    // Notify Cooperative Admin
    await transporter.sendMail({
      to: process.env.COOP_EMAIL,
      subject: "🔐 New User Registration Pending",
      html: `
        <h3>${role.toUpperCase()} Registration</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${
          role === "vendor"
            ? `
              <p><strong>Organization:</strong> ${organization}</p>
              <p><strong>GSTIN:</strong> ${gstin}</p>
              <p><strong>Items:</strong><ul>
                ${vendorItems.map((i) => `<li>${i.name}: ${i.description}</li>`).join("")}
              </ul></p>
            `
            : `<p><strong>Note:</strong> ${note}</p>`
        }
      `,
    });

    res.status(201).json({ message: "Registration submitted. Await admin approval." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// ======================
// 🔐 LOGIN USER
// ======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isApproved) {
      return res.status(401).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

// ==============================
// ⏳ GET PENDING USERS (Detailed)
// ==============================
exports.getPendingUsers = async (req, res) => {
  try {
    const pending = await User.find({ isApproved: false }).lean();

    const enriched = await Promise.all(
      pending.map(async (u) => {
        if (u.role === "vendor") {
          const items = await VendorItem.find({ vendor: u._id }).lean();
          return { ...u, vendorItems: items };
        }
        return u;
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Pending fetch error:", err);
    res.status(500).json({ message: "Could not fetch pending users" });
  }
};

// ============================
// 📊 GET PENDING USERS COUNT
// ============================
exports.getPendingUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ isApproved: false });
    res.status(200).json({ count });
  } catch (err) {
    console.error("Pending count error:", err);
    res.status(500).json({ message: "Could not fetch pending users count" });
  }
};

// ============================
// ✅ GET APPROVED USERS
// ============================
exports.getApprovedUsers = async (req, res) => {
  try {
    const approved = await User.find({ isApproved: true }).lean();

    const enriched = await Promise.all(
      approved.map(async (u) => {
        if (u.role === "vendor") {
          const items = await VendorItem.find({ vendor: u._id }).lean();
          return { ...u, vendorItems: items };
        }
        return u;
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Approved fetch error:", err);
    res.status(500).json({ message: "Could not fetch approved users" });
  }
};

// ==================
// ✅ APPROVE USER
// ==================
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
      subject: "🎉 Your account has been approved",
      html: `
        <p>Hello ${user.name},</p>
        <p>Your registration has been approved. You can now log in to ProcureHub.</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `,
    });

    res.status(200).json({ message: "User approved" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Could not approve user" });
  }
};

// ==================
// ❌ REJECT USER
// ==================
exports.rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "vendor") {
      await VendorItem.deleteMany({ vendor: user._id });
    }

    await transporter.sendMail({
      to: user.email,
      subject: "❌ Registration Rejected",
      html: `
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your registration has been rejected. Please contact the cooperative if you believe this was a mistake.</p>
      `,
    });

    res.status(200).json({ message: "User rejected and deleted" });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ message: "Could not reject user" });
  }
};
