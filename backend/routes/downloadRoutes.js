// routes/downloadRoutes.js
const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const Student = require("../models/Student");

// Route: GET /api/download/admissions
router.get("/admissions", async (req, res) => {
  try {
    const students = await Student.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Admissions");

    // Add Header Row
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Course", key: "course", width: 20 },
      { header: "Message", key: "message", width: 40 },
      { header: "Date", key: "createdAt", width: 20 }
    ];

    // Add Data Rows
    students.forEach(student => {
      worksheet.addRow(student);
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admissions.xlsx"
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Excel download error:", err);
    res.status(500).json({ success: false, message: "Download failed" });
  }
});

module.exports = router;
