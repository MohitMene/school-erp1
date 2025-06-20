const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const admissionRoutes = require("./routes/admissionRoutes");
const authRoutes = require("./routes/authRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admission", admissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", razorpayRoutes); // 💰 Razorpay
app.use("/api/download", downloadRoutes);

// Serve static frontend (Optional: for local full-stack testing)
//const frontendPath = path.join(__dirname, "../frontend");
//app.use(express.static(frontendPath));

// Fallback to index.html (for single-page apps, optional)
//app.get(/^\/(?!api).*/, (req, res) => {
  //res.sendFile(path.join(frontendPath, "index.html"));
//});//


// MongoDB URI and Port
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/schooldb";
const PORT = process.env.PORT || 5000;

// MongoDB Connection & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit on DB error
  });
