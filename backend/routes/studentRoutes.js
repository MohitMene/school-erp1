const express = require('express');
const router = express.Router();
const StudentMarks = require('../models/StudentMarks');
const StudentLogin = require('../models/StudentLogin');
const verifyStudentToken = require('../middleware/verifyStudentToken');

// GET marks by student (protected)
router.get('/marks', verifyStudentToken, async (req, res) => {
  try {
    const username = req.student.username;
    const marks = await StudentMarks.find({ studentUsername: username });
    res.json({ success: true, marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch marks' });
  }
});

// 🆕 GET student profile (protected)
router.get('/profile', verifyStudentToken, async (req, res) => {
  try {
    const student = await StudentLogin.findOne({ username: req.student.username }).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, profile: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

module.exports = router;
