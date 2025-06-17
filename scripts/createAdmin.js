const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPass = await bcrypt.hash("admin123", 10); // change password later

  const admin = new Admin({
    username: "admin",
    password: hashedPass,
  });

  await admin.save();
  console.log("✅ Admin user created");
  process.exit();
}

createAdmin();
