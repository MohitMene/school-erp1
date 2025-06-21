// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded credentials for demo
  if (email === 'admin' && password === 'admin123') {
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
