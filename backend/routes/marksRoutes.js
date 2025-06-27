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

// Middleware to protect route using admin token
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  });
}

// POST: Add marks (admin only)
router.post('/add', verifyAdminToken, async (req, res) => {
  const { studentUsername, subject, marks } = req.body;
  try {
    const newMark = new Marks({ studentUsername, subject, marks });
    await newMark.save();
    res.json({ success: true, message: 'Marks added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: Student can fetch own marks
router.get('/student', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, student) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

    try {
      const data = await Marks.find({ studentUsername: student.username });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch marks' });
    }
  });
});

module.exports = router;
