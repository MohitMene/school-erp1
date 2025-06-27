const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentUsername: { type: String, required: true },
  subject: String,
  marks: Number,
  exam: String, // e.g., "Midterm", "Final"
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentMarks', marksSchema);
