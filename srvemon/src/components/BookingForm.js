
import React, { useState, useEffect } from "react";

function BookingForm({ availableTimes, dispatch, submitForm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Birthday");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ Function to validate the form
  useEffect(() => {
    let newErrors = {};
    if (!date) newErrors.date = "Date is required.";
    if (!time) newErrors.time = "Time is required.";
    if (guests < 1 || guests > 10) newErrors.guests = "Guests must be between 1 and 10.";

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [date, time, guests]);

  // ✅ Handle date change and update available times
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(e.target.value);
    dispatch({ type: "UPDATE_TIMES", payload: newDate });
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      submitForm({ date, time, guests, occasion });
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

      {/* ✅ Improved Accessibility: Labels + ARIA attributes */}
      <label htmlFor="res-date">Choose date</label>
      <input 
        type="date" 
        id="res-date" 
        value={date} 
        onChange={handleDateChange} 
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
          availableTimes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))
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
      </select>

      {/* ✅ Improved Button Accessibility */}
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

