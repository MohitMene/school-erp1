const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure .env is loaded

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Basic login check — you can enhance this later
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
