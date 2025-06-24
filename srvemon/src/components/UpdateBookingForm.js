


// src/components/UpdateBookingForm.js
import React, { useEffect, useRef, useState } from "react";
import "./BookingForm/BookingForm.css";
import { isToday , getSelectableStartDate} from "../utils/dateUtils";

function UpdateBookingForm({ booking, onSubmit, updateTimes, availableTimes }) {
  const [formData, setFormData] = useState({
    reservation_date: booking.reservation_date,
    reservation_time: booking.reservation_time,
    no_of_guests: booking.no_of_guests,
    occasion: booking.occasion,
  });
  const [initialTime] = useState(booking.reservation_time);
  const [touchedDate, setTouchedDate] = useState(false);
  const [touchedTime, setTouchedTime] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const lastUpdatedDateRef = useRef(booking.reservation_date);


  const isTimePast = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const now = new Date();
    const slot = new Date();
    slot.setHours(h, m, 0, 0);
    return slot < now;
  };

  useEffect(() => {
    if (touchedDate && formData.reservation_date !== lastUpdatedDateRef.current) {
      lastUpdatedDateRef.current = formData.reservation_date;
      updateTimes(new Date(formData.reservation_date));
    }
  }, [formData.reservation_date, updateTimes, touchedDate]);

  useEffect(() => {
    let newErrors = {};
    if (!formData.reservation_date) newErrors.reservation_date = "Date is required.";
    if (!formData.reservation_time) newErrors.reservation_time = "Time is required.";
    if (formData.no_of_guests < 1 || formData.no_of_guests > 10) {
      newErrors.no_of_guests = "Guests must be between 1 and 10.";
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "reservation_date") setTouchedDate(true);
    if (name === "reservation_time") setTouchedTime(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      reservation_date: booking.reservation_date,
      reservation_time: booking.reservation_time,
      no_of_guests: booking.no_of_guests,
      occasion: booking.occasion,
    });
    setTouchedDate(false);
    setTouchedTime(false);
    lastUpdatedDateRef.current = booking.reservation_date;
  };

  const showAvailableTimes = touchedDate || touchedTime;
  const timesToRender = showAvailableTimes ? availableTimes : [initialTime];

  // const today = getLocalToday();
  const today = getSelectableStartDate();


  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
      aria-labelledby="booking-form-title"
      aria-live="polite"
    >
      <h2 id="booking-form-title">Update Your Reservation</h2>

      <label htmlFor="res-date">Choose date</label>
      <input
        type="date"
        id="res-date"
        name="reservation_date"
        value={formData.reservation_date}
        onChange={handleChange}
        min={today}
        required
        aria-required="true"
        aria-invalid={!!errors.reservation_date}
      />
      {errors.reservation_date && <p role="alert">{errors.reservation_date}</p>}

      <label htmlFor="res-time">Choose time</label>
      <select
        id="res-time"
        name="reservation_time"
        value={formData.reservation_time}
        onChange={handleChange}
        required
        aria-required="true"
        aria-invalid={!!errors.reservation_time}
      >
        <option value="">Select a time</option>
        {timesToRender.map((t) => {
          const isDisabled = isToday(formData.reservation_date) && isTimePast(t);
          return (
            <option
              key={t}
              value={t}
              disabled={isDisabled}
              style={isDisabled ? { color: "gray" } : {}}
            >
              {t} {isDisabled ? "(Unavailable)" : ""}
            </option>
          );
        })}
      </select>
      {errors.reservation_time && <p role="alert">{errors.reservation_time}</p>}

      <label htmlFor="no_of_guests">Number of guests</label>
      <input
        type="number"
        id="no_of_guests"
        name="no_of_guests"
        min="1"
        max="10"
        value={formData.no_of_guests}
        onChange={handleChange}
        required
        aria-required="true"
        aria-invalid={!!errors.no_of_guests}
      />
      {errors.no_of_guests && <p role="alert">{errors.no_of_guests}</p>}

      <label htmlFor="occasion">Occasion</label>
      <select
        id="occasion"
        name="occasion"
        value={formData.occasion}
        onChange={handleChange}
        aria-label="Select occasion"
      >
        <option value="Birthday">Birthday</option>
        <option value="Anniversary">Anniversary</option>
        <option value="Other">Other</option>
      </select>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button
          type="submit"
          disabled={!isFormValid}
          aria-label="Submit reservation update"
        >
          Submit Update
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{ backgroundColor: "#ccc", color: "#333" }}
        >
          Cancel Update
        </button>
      </div>
    </form>
  );
}

export default UpdateBookingForm;
