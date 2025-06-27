const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Marks schema
const marksSchema = new mongoose.Schema({
  studentUsername: String,
  subject: String,
  marks: Number,
});
const Marks = mongoose.model('Marks', marksSchema);

// Middleware to protect admin routes
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  });
}

// Middleware for student routes
function verifyStudentToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, student) => {
    if (err || student.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    req.student = student; // Attach student info to request
    next();
  });
}

// Admin-only: Add Marks
router.post('/add', verifyAdminToken, async (req, res) => {
  const { studentUsername, subject, marks } = req.body;
  try {
    const newMark = new Marks({ studentUsername, subject, marks });
    await newMark.save();
    res.json({ success: true, message: 'Marks added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Student-only: View Marks
router.get('/student', verifyStudentToken, async (req, res) => {
  try {
    const data = await Marks.find({ studentUsername: req.student.username });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
