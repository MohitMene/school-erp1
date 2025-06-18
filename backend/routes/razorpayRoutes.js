// routes/razorpayRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv"); // ✅ Load env variables
dotenv.config(); // ✅ Important to load .env values

const router = express.Router();

// 🔐 Load Razorpay keys from environment
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// 🏦 Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// 💳 Create Order Route (POST /api/payment/order)
router.post("/order", async (req, res) => {
  const { amount, currency = "INR", receipt = "receipt#1" } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert ₹ to paise
      currency,
      receipt,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Razorpay Error:", err);
    res.status(500).json({ success: false, message: "Payment order failed" });
  }
});

module.exports = router;
