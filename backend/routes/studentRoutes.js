const express = require('express');
const router = express.Router();
const StudentMarks = require('../models/StudentMarks');
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

module.exports = router;
