const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const requestRoutes = require("./routes/requestRoutes");

// Load environment variables
dotenv.config();

console.log("✅ MAIL_HOST from .env:", process.env.MAIL_HOST);  // <-- ADD THIS


const app = express();

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));


// Health check endpoint
app.get("/", (req, res) => res.send("✅ Backend is running"));

// Seed cooperative admin user if not exists
async function seedCoopUser() {
  try {
    const existing = await User.findOne({ email: process.env.COOP_EMAIL });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.COOP_PASSWORD, 10);
      await User.create({
        name: "Cooperative Admin",
        email: process.env.COOP_EMAIL,
        password: hashedPassword,
        role: "cooperative",
        isApproved: true,
      });
      console.log("🌱 Cooperative admin user seeded");
      console.log(`📧 Email: ${process.env.COOP_EMAIL}`);
      console.log(`🔑 Password: ${process.env.COOP_PASSWORD}`);
    } else {
      console.log("🌱 Cooperative admin user already exists");
      console.log(`📧 Email: ${existing.email}`);
      // Not printing password for security
    }
  } catch (error) {
    console.error("❌ Error seeding cooperative user:", error);
  }
}

// Start server and connect to DB
connectDB().then(() => {
  seedCoopUser();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
