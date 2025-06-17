const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Replace with real validation logic
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
