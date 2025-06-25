const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  let token;

  // 1️⃣ Check Authorization Header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Check token in query string (for Excel/PDF downloads)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  // ❌ No token found
  if (!token) {
    return res.status(401).json({ message: "No token provided or invalid format." });
  }

  // ✅ Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
