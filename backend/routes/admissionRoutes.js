const express = require("express");
const router = express.Router();
const { submitAdmission } = require("../controllers/admissionController");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");

// 🔽 Add this: Public route for submitting admission form
router.post("/", submitAdmission);


// ✅ Now protected with token
router.get("/", verifyToken, async (req, res) => {
  try {
    const students = await Student.find().sort({ date: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving students" });
  }
});

module.exports = router;
