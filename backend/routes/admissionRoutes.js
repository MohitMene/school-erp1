const express = require("express");
const router = express.Router();
const { submitAdmission } = require("../controllers/admissionController");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");
const ExcelJS = require("exceljs"); // ✅ New: ExcelJS added
const PDFDocument = require('pdfkit');

// 🔽 Add this: Public route for submitting admission form
router.post("/", submitAdmission);


// ✅ Now protected with token
router.get("/", verifyToken, async (req, res) => {
  try {
    const students = await Student.find().sort({ date: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving students" });
  }
});


// 🧾 3. New route: Download admissions as Excel
router.get("/download/excel", verifyToken, async (req, res) => {
  try {
    const students = await Student.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Admissions");

    worksheet.columns = [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Phone", key: "phone" },
      { header: "Course", key: "course" },
      { header: "Message", key: "message" },
    ];

    students.forEach((student) => {
      worksheet.addRow(student);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=admissions.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
});

router.get("/download/pdf", verifyToken, async (req, res) => {
  try {
    const students = await Student.find().sort({ date: -1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="admissions.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Admission Submissions', { align: 'center' });
    doc.moveDown();

    students.forEach((student, i) => {
      doc
        .fontSize(12)
        .text(`Name: ${student.name}`)
        .text(`Email: ${student.email}`)
        .text(`Phone: ${student.phone}`)
        .text(`Course: ${student.course}`)
        .text(`Message: ${student.message}`)
        .text(`Date: ${new Date(student.date).toLocaleString()}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

module.exports = router;
