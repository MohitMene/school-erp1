const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const jwt = require('jsonwebtoken');

// Middleware to verify student
function verifyStudentToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'student') return res.status(403).json({ message: 'Invalid token' });
    req.student = decoded;
    next();
  });
}

// 🧾 GET /api/fees/student → view fee status
router.get('/student', verifyStudentToken, async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentUsername: req.student.username });
    if (!fee) return res.status(404).json({ message: 'Fee data not found' });

    const pending = fee.totalFees - fee.paidFees;
    const today = new Date();
    let lateFine = 0;

    if (today > fee.dueDate) lateFine = 100;

    res.json({
      totalFees: fee.totalFees,
      paidFees: fee.paidFees,
      pendingFees: pending,
      dueDate: fee.dueDate,
      lateFine,
      paymentHistory: fee.paymentHistory,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 💰 POST /api/fees/pay → record a payment
router.post('/pay', verifyStudentToken, async (req, res) => {
  const { amount, receiptId } = req.body;

  try {
    const fee = await Fee.findOne({ studentUsername: req.student.username });
    if (!fee) return res.status(404).json({ message: 'Fee data not found' });

    fee.paidFees += amount;
    fee.paymentHistory.push({ amount, receiptId });

    await fee.save();

    res.json({ message: 'Payment recorded', paidFees: fee.paidFees, pendingFees: fee.totalFees - fee.paidFees });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed' });
  }
});
module.exports = router; // ✅
// Export the router to use in server.js
// This allows the fee routes to be mounted in the main server file