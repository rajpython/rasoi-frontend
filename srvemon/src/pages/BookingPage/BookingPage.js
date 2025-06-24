

// src/pages/BookingPage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../../components/BookingForm/BookingForm";
import { fetchAPI, submitAPI } from "../../api/bookingApi";
import "./BookingPage.css";
import { useBooking } from "../../context/BookingContext";



function BookingPage() {
  const [availableTimes, setAvailableTimes] = useState([]);
  const { setReservationData } = useBooking();
  const navigate = useNavigate();

  // Initial fetch for today
  useEffect(() => {
    const today = new Date();
    fetchAPI(today).then(setAvailableTimes);
  }, []);

  // Handle date change
  const updateTimes = (date) => {
    fetchAPI(date).then(setAvailableTimes);
  };


// Inside your component
  

  const submitForm = async (formData) => {
    const success = await submitAPI(formData);
    if (success) {
      setReservationData(formData);
      navigate("/confirmation");
    }
  };




  return (
    <section className="booking-page">
      <p style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Fill out the form below to reserve a table.
      </p>
      <BookingForm
        availableTimes={availableTimes}
        updateTimes={updateTimes}
        submitForm={submitForm}
      />
    </section>
  );
}

export default BookingPage;
