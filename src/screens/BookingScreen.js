import React, { useState, useCallback } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale"; // Import the locale you want to use

registerLocale("en-GB", enGB);

const today = new Date();
today.setHours(0, 0, 0, 0);

// Only allow 17:00, 17:30, 18:00, 18:30, 19:00, 19:30, 20:00
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 17; hour <= 20; hour++) {
    slots.push(new Date(0, 0, 0, hour, 0));
    if (hour < 20) slots.push(new Date(0, 0, 0, hour, 30));
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();

const excludedDates = [
  new Date(2026, 5, 19),
  new Date(2026, 5, 20),
  new Date(2026, 5, 21),
  new Date(2026, 5, 24),
  new Date(2026, 5, 26),
  new Date(2026, 5, 27),
  new Date(2026, 5, 28),
  new Date(2026, 6, 1),
  new Date(2026, 6, 25),
  new Date(2026, 6, 26),
  new Date(2026, 6, 1),
  new Date(2026, 6, 11),
  new Date(2026, 6, 18),
  new Date(2026, 6, 19),
  new Date(2026, 6, 29),
  new Date(2026, 6, 30),
  new Date(2026, 6, 31),
  new Date(2026, 7, 1),
  new Date(2026, 7, 2),
  new Date(2026, 7, 14),
  new Date(2026, 7, 15),
  new Date(2026, 7, 16),
];

const BookingScreen = React.memo(() => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(new Date(0, 0, 0, 17, 0));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = useCallback(async () => {
    if (!name || !email || !selectedDate || !selectedTime) {
      alert("Please fill in all fields.");
      return;
    }

    // Format date as YYYY-MM-DD
    const date = selectedDate.toISOString().split("T")[0];

    // Format time as HH:MM
    const time = selectedTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/server.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, date, time }),
      });

      // Log the response for debugging
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error(
          `Server responded with: ${responseText || "empty response"}`,
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send reservation.");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, selectedDate, selectedTime]);

  const handleNewBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setEmail("");
    setIsSuccess(false);
    setError(null);
  };

  if (isSubmitting) {
    return (
      <div className="booking-screen">
        <h1>Sending your request...</h1>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="booking-screen">
        <h1>Reservation Confirmed!</h1>
        <p>
          Thank you, {name}. A confirmation email has been sent to {email}.
        </p>
        <button className="booking-button" onClick={handleNewBooking}>
          Make Another Reservation
        </button>
      </div>
    );
  }

  return (
    <div className="booking-screen">
      <h1>Reserve a Table</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <input
        className="booking-input"
        placeholder="Your name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        className="booking-input"
        placeholder="Your email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <h3>Select a date</h3>
      <DatePicker
        inline
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={today}
        maxDate={new Date(today.getFullYear(), today.getMonth() + 3, 0)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Pick a date"
        className="booking-input"
        wrapperClassName="booking-datepicker-wrapper"
        calendarClassName="booking-calendar"
        excludeDates={excludedDates}
        calendarStartDay={1}
        locale="en-GB"
      />

      <h3>Select a time</h3>
      <DatePicker
        selected={selectedTime}
        onChange={(time) => setSelectedTime(time)}
        showTimeSelect
        showTimeSelectOnly
        includeTimes={TIME_SLOTS}
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="HH:mm"
        placeholderText="Pick a time"
        className="booking-input"
        wrapperClassName="booking-datepicker-wrapper"
        locale="en-GB"
      />

      <br />
      <button className="booking-button" onClick={submitBooking}>
        Confirm Reservation
      </button>
    </div>
  );
});

export default BookingScreen;
