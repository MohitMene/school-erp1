const mongoose = require('mongoose');

const StudentLoginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // optional link
});

module.exports = mongoose.model('StudentLogin', StudentLoginSchema);
