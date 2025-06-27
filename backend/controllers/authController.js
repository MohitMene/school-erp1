const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const StudentLogin = require("../models/StudentLogin"); // 👈 create this model
require("dotenv").config(); // Ensure .env is loaded

// ✅ Admin Login (existing)
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

// ✅ Student Login
exports.loginStudent = async (req, res) => {
  const { username, password } = req.body;

  try {
    const student = await StudentLogin.findOne({ username });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { username: student.username, role: "student", studentId: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Student Register (optional)
exports.registerStudent = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await StudentLogin.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new StudentLogin({ username, password: hashedPassword });
    await newStudent.save();

    res.status(201).json({ success: true, message: "Student registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
