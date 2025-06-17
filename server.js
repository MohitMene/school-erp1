const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
 const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log("👉 Loading admissionRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
app.use("/api/admission", admissionRoutes);
app.use("/api/auth", authRoutes);


// MongoDB URI and Port from .env or fallback
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/schooldb";
const PORT = process.env.PORT || 5000;

// Connect DB & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

  
