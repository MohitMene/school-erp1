// models/Fee.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  receiptId: String
});

const feeSchema = new mongoose.Schema({
  studentUsername: String,
  totalFees: { type: Number, default: 8000 },
  paidFees: { type: Number, default: 0 },
  dueDate: Date,
  paymentHistory: [paymentSchema],
});

module.exports = mongoose.model('Fee', feeSchema);
