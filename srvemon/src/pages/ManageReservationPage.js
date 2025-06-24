


// src/pages/ManageReservationPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import UpdateBookingForm from "../components/UpdateBookingForm";
import { fetchAPI } from "../api/bookingApi";
import BASE_URL from "../apiConfig";

function ManageReservationPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const API_BASE = `${BASE_URL}/restaurante/booking`;

  useEffect(() => {
    fetch(`${API_BASE}/manage/${ref}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        setBooking(data);
        fetchAPI(new Date(data.reservation_date)).then(setAvailableTimes);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Booking not found.");
        setIsLoading(false);
      });
  }, [ref]);

  const updateTimes = (date) => {
    fetchAPI(date).then(setAvailableTimes);
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/manage/${ref}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      setConfirmationMessage("Booking updated and a confirmation email has been sent.");
    } catch {
      setConfirmationMessage("Failed to update booking.");
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`${API_BASE}/manage/${ref}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Cancel failed");
      setConfirmationMessage("Your booking has been cancelled.");
    } catch {
      setConfirmationMessage("Failed to cancel booking.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="booking-page" style={{ paddingTop: "150px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Manage Your Reservation</h2>
      {confirmationMessage ? (
        <div className="confirmation-message" style={{ marginBottom: "1.5rem", backgroundColor: "#f0fdf4", padding: "1rem", borderRadius: "8px" }}>
          <p>{confirmationMessage}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "0.5rem", color: "blue", textDecoration: "underline" }}>
            Return to Home
          </button>
        </div>
      ) : (
        <>
          <UpdateBookingForm
            booking={booking}
            availableTimes={availableTimes}
            updateTimes={updateTimes}
            onSubmit={handleUpdate}
          />

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "#fff", color: "red", border: "1px solid red", padding: "0.75rem 1rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              Cancel Reservation
            </button>
          </div>

          <ConfirmModal
            open={showModal}
            title="Cancel Reservation"
            message="Are you sure you want to cancel your reservation? This action cannot be undone."
            onConfirm={() => {
              setShowModal(false);
              handleCancel();
            }}
            onCancel={() => setShowModal(false)}
          />
        </>
      )}
    </section>
  );
}

export default ManageReservationPage;



