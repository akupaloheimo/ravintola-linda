// api/server.js

require("dotenv").config(); // Make sure dotenv is at the top
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
  // Note the path change to /api/book
  const newBooking = req.body;
  const { name, email, date, time } = newBooking;

  try {
    // --- Email sending logic ---
    await transporter.sendMail({
      from: "paloheimo2005@gmail.com",
      to: email,
      subject: "Reservation Confirmation",
      text: `Hello ${name},\n\nYour reservation is confirmed.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nWe look forward to seeing you!`,
    });

    // --- File writing logic (for demonstration, not persistent on Vercel) ---
    let reservations = [];
    if (fs.existsSync(reservationsPath)) {
      const data = fs.readFileSync(reservationsPath, "utf8");
      reservations = JSON.parse(data);
    }
    reservations.push(newBooking);
    fs.writeFileSync(reservationsPath, JSON.stringify(reservations, null, 2));

    res.json({
      success: true,
      message: "Reservation confirmed",
    });
  } catch (error) {
    console.log("Error processing booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your reservation.",
    });
  }
});

// DO NOT USE app.listen(). Vercel handles this.
// Instead, export the app instance.
module.exports = app;
