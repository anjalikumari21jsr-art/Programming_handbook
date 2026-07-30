import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import QRCode from "qrcode";
import sendEmail from "./sendEmail.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ TEMP STORAGE (for demo)
const users = [];
const feedbacks = [];


// ==============================
// ✅ REGISTER API
// ==============================
app.post("/register", async (req, res) => {
  try {
    const data = req.body;

    // ✅ VALIDATION
    if (!data.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ SAVE USER (temporary array)
    users.push(data);

    // ✅ GENERATE FEEDBACK URL
    const feedbackUrl = `http://localhost:5173/feedback?email=${data.email}`;

    // ✅ GENERATE QR
    const qrCode = await QRCode.toDataURL(feedbackUrl);

    console.log("User Registered:", data.email);

    // ✅ SEND RESPONSE
    res.json({
      success: true,
      qrCode,
      feedbackUrl,
    });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});


// ==============================
// ✅ FEEDBACK API
// ==============================
app.post("/feedback", async (req, res) => {
  try {
    const { email, message, rating, recommend, improvements } = req.body;

    // ✅ VALIDATION
    if (!email || !message) {
      return res.status(400).json({ message: "Email and message required" });
    }

    // ✅ SAVE FEEDBACK (temporary)
    feedbacks.push({
      email,
      message,
      rating,
      recommend,
      improvements,
    });

    console.log("Feedback Received from:", email);

    // ✅ SEND EMAIL
    await sendEmail(
      email,
      "Feedback Received ✅",
      `Thank you for your feedback!

Message: ${message}
Rating: ${rating}
Recommend: ${recommend}
Improvements: ${improvements?.join(", ")}`
    );

    console.log("Email sent successfully ✅");

    res.json({
      success: true,
      message: "Feedback submitted & email sent ✅",
    });

  } catch (err) {
    console.log("Feedback Error:", err);

    res.status(500).json({
      success: false,
      message: "Feedback failed or email error ❌",
    });
  }
});


// ==============================
// ✅ SERVER START
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});