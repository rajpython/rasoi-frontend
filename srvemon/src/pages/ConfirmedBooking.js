
// src/pages/ConfirmedBooking.js
import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmedBooking({ reservationData }) {
  const navigate = useNavigate();

  return (
    <section className="confirmed-booking">
      <h2>Booking Confirmed!</h2>
      {reservationData ? (
        <>
          <p>Thank you for reserving a table at Rasoi.</p>
          <p><strong>Date:</strong> {reservationData.date}</p>
          <p><strong>Time:</strong> {reservationData.time}</p>
          <p><strong>Guests:</strong> {reservationData.guests}</p>
          <p>We look forward to serving you!</p>
        </>
      ) : (
        <p>No booking details found.</p>
      )}
      <button onClick={() => navigate("/")}>Return to Home</button>
    </section>
  );
}

export default ConfirmedBooking;
