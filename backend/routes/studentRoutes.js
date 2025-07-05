const express = require('express');
const router = express.Router();
const StudentMarks = require('../models/StudentMarks');
const StudentLogin = require('../models/StudentLogin');
const verifyStudentToken = require('../middleware/verifyStudentToken');

// ✅ GET student marks (protected)
router.get('/marks', verifyStudentToken, async (req, res) => {
  try {
    console.log('🔐 Authenticated student:', req.student); // Debug log

    const username = req.student.username;
    const marks = await StudentMarks.find({ studentUsername: username });

    if (!marks || marks.length === 0) {
      return res.status(404).json({ success: false, message: 'No marks found for this student.' });
    }

    res.json({ success: true, marks });
  } catch (err) {
    console.error('❌ Error fetching student marks:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch marks' });
  }
});

// ✅ GET student profile (protected)
router.get('/profile', verifyStudentToken, async (req, res) => {
  try {
    console.log('🔐 Fetching profile for:', req.student.username); // Debug log

    const student = await StudentLogin.findOne({ username: req.student.username }).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, profile: student });
  } catch (err) {
    console.error('❌ Error fetching student profile:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// 🧪 Optional: DEBUG route to verify token decoding on Render
router.get('/debug/token', verifyStudentToken, (req, res) => {
  res.json({ decodedToken: req.student });
});

module.exports = router;
