const Student = require("../models/Student");
const nodemailer = require("nodemailer");

exports.submitAdmission = async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  try {
    // 1. Save admission to MongoDB
    const newStudent = new Student({ name, email, phone, course, message });
    await newStudent.save();

    // 2. Send email to school
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
    rejectUnauthorized: false, // 👈 This allows self-signed certificates
  },
    });

    const mailOptions = {
      from: `"School Admission" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your school/admin email
      subject: "📥 New Admission Form Submission",
      html: `
        <h2>New Admission Form Submitted</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "✅ Admission submitted and email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Admission submission error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Something went wrong while submitting the form.",
    });
  }
};
