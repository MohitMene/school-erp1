const express = require("express");
const router = express.Router();
const { loginAdmin,  loginStudent , registerStudent } = require("../controllers/authController");

router.post("/login", loginAdmin);

// Student login
router.post("/student/login", loginStudent);

// Optional: Student registration
router.post("/student/register", registerStudent);


module.exports = router;
