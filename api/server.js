// api/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// The path will now be relative to this file inside the /api directory
const reservationsPath = path.join(__dirname, "reservations.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "paloheimo2005@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

app.post("/book", async (req, res) => {
  const newBooking = req.body;
  const { name, email, date, time } = newBooking;

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

    console.log("Email sent successfully:", mailResponse.messageId);

    // --- File writing logic (only on local/non-Vercel environments) ---
    if (process.env.VERCEL !== "1") {
      try {
        let reservations = [];
        if (fs.existsSync(reservationsPath)) {
          const data = fs.readFileSync(reservationsPath, "utf8");
          reservations = JSON.parse(data);
        }
        reservations.push(newBooking);
        fs.writeFileSync(
          reservationsPath,
          JSON.stringify(reservations, null, 2),
        );
        console.log("Reservation saved to file");
      } catch (fileError) {
        console.log(
          "File writing skipped (expected on Vercel):",
          fileError.message,
        );
      }
    }

    res.json({
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
});

module.exports = app;
