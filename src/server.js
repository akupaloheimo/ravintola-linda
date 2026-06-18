require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs"); // Move fs import to the top
const path = require("path"); // Use path module for robust file paths

const app = express();

app.use(cors());
app.use(express.json());

// Define path to reservations.json
const reservationsPath = path.join(__dirname, "reservations.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "paloheimo2005@gmail.com", // Replace with your actual email
    pass: process.env.APP_PASSWORD, // Replace with your actual app password
  },
});

app.post("/book", async (req, res) => {
  const newBooking = ({ name, email, date, time } = req.body);

  try {
    // --- Email sending logic ---
    // Email to customer
    await transporter.sendMail({
      from: "paloheimo2005@gmail.com",
      to: email,
      subject: "Reservation Confirmation",
      text: `
Hello ${name},

Your reservation is confirmed.

Date: ${new Date(date).toLocaleDateString()}
Time: ${time}

We look forward to seeing you!
      `,
    });

    // --- File writing logic ---
    // Read existing reservations, add the new one, and write back to the file
    fs.readFile(reservationsPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading reservations file:", err);
        // If the file doesn't exist, start with a new array
        if (err.code === "ENOENT") {
          const reservations = [newBooking];
          fs.writeFileSync(
            reservationsPath,
            JSON.stringify(reservations, null, 2),
          );
          return;
        }
        return; // Stop execution if there was another type of read error
      }

      const reservations = JSON.parse(data);
      reservations.push(newBooking);
      fs.writeFileSync(reservationsPath, JSON.stringify(reservations, null, 2));
    });

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

app.listen(5000, () => console.log("Server running on port 5000"));
