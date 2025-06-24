


import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";  // 👈 Import the custom hook
import "./ConfirmedBooking.css"
import { formatDate } from "../../utils/dateUtils"; 

function ConfirmedBooking() {
  const navigate = useNavigate();
  const { reservationData } = useBooking();  // 👈 Access reservation data from context
  console.log("Reservation data in ConfirmedBooking:", reservationData);

  return (
    <section className="confirmed-booking">
      <h2>Booking Confirmed!</h2>
      {/* <div style={{ backgroundColor: "#f0f0f0", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
        <pre>{JSON.stringify(reservationData, null, 2)}</pre>
      </div> */}

      {reservationData ? (
        <>
          <p>Thank you for reserving a table at Rasoi.</p>
          <p><strong>Date:</strong> {formatDate(reservationData.reservation_date)}</p>
          <p><strong>Time:</strong> {reservationData.reservation_time}</p>
          <p><strong>Guests:</strong> {reservationData.no_of_guests}</p>
          <p>Happy {reservationData.occasion} in advance!</p>
          <p>We look forward to serving you!</p>
          <p style={{ marginTop: "1rem", color: "green" }}>
            A confirmation email has been sent to <strong>{reservationData.email}</strong>.
          </p>
        </>
      ) : (
        <p>No booking details found.</p>
      )}
      <button onClick={() => navigate("/")}>Return to Home</button>
    </section>
  );
}

export default ConfirmedBooking;
