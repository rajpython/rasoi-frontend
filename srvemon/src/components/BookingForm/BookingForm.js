

// src/components/BookingForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./BookingForm.css";
import { isToday, getSelectableStartDate } from "../../utils/dateUtils";


function BookingForm({ availableTimes, updateTimes, submitForm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Birthday");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    let newErrors = {};
    if (!date) newErrors.date = "Date is required.";
    if (!time) newErrors.time = "Time is required.";
    if (guests < 1 || guests > 10) newErrors.guests = "Guests must be between 1 and 10.";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required.";

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [date, time, guests, email]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    updateTimes(new Date(newDate));
  };

  const isTimePast = (dateStr, timeStr) => {
    if (!dateStr || !timeStr.includes(":")) return false;

    if (!isToday(dateStr)) return false;

    const [h, m] = timeStr.split(":").map(Number);
    const now = new Date();
    const selectedSlot = new Date();
    selectedSlot.setHours(h, m, 0, 0);

    return selectedSlot <= now;
  };

  // const today = getLocalToday();
  const today = getSelectableStartDate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      submitForm({
        reservation_date: date,
        reservation_time: time,
        no_of_guests: parseInt(guests, 10),
        occasion,
        email,
      });
    }
  };

  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
      aria-labelledby="booking-form-title"
      aria-live="polite"
    >
      <h2 id="booking-form-title">Reserve a Table</h2>

      <label htmlFor="res-date">Choose date</label>
      <input
        type="date"
        id="res-date"
        value={date}
        onChange={handleDateChange}
        min={today}
        required
        aria-required="true"
        aria-invalid={!!errors.date}
      />
      {errors.date && <p role="alert">{errors.date}</p>}

      <label htmlFor="res-time">Choose time</label>
      <select
        id="res-time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        aria-required="true"
        aria-invalid={!!errors.time}
        aria-label="Select available time"
      >
        <option value="">Select a time</option>
        {availableTimes.length > 0 ? (
          availableTimes.map((t) => {
            const disabled = date && isTimePast(date, t);
            return (
              <option
                key={t}
                value={t}
                disabled={disabled}
                style={disabled ? { color: "gray" } : {}}
              >
                {t} {disabled ? "(Unavailable)" : ""}
              </option>
            );
          })
        ) : (
          <option disabled>No available slots</option>
        )}
      </select>
      {errors.time && <p role="alert">{errors.time}</p>}

      <label htmlFor="guests">Number of guests</label>
      <input
        type="number"
        id="guests"
        min="1"
        max="10"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        required
        aria-required="true"
        aria-invalid={!!errors.guests}
      />
      {errors.guests && <p role="alert">{errors.guests}</p>}

      <label htmlFor="occasion">Occasion</label>
      <select
        id="occasion"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        aria-label="Select occasion"
      >
        <option value="Birthday">Birthday</option>
        <option value="Anniversary">Anniversary</option>
        <option value="Other">Other</option>
      </select>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-required="true"
        aria-invalid={!!errors.email}
      />
      {errors.email && <p role="alert">{errors.email}</p>}

      <button
        type="submit"
        disabled={!isFormValid}
        aria-label="On Click: Make Your Reservation"
      >
        Make Your Reservation
      </button>
    </form>
  );
}

export default BookingForm;
