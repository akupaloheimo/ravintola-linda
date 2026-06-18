// api/book.js

require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "paloheimo2005@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, date, time } = req.body;

  // Validate input
  if (!name || !email || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Check if APP_PASSWORD is set
    if (!process.env.APP_PASSWORD) {
      throw new Error("APP_PASSWORD environment variable is not set");
    }

    // --- Email sending logic ---
    const mailResponse = await transporter.sendMail({
      from: "paloheimo2005@gmail.com",
      to: email,
      subject: "Reservation Confirmation",
      text: `Hello ${name},\n\nYour reservation is confirmed.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nWe look forward to seeing you!`,
    });

    await transporter.sendMail({
      from: "paloheimo2005@gmail.com",
      to: "aku.paloheimo@gmail.com",
      subject: "New Reservation",
      text: `
New booking received!

Name: ${name}
Email: ${email}
Date: ${date}
Time: ${time}
`,
    });

    console.log("Email sent successfully:", mailResponse.messageId);

    res.status(200).json({
      success: true,
      message: "Reservation confirmed",
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while processing your reservation.",
    });
  }
};
