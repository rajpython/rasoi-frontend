


import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";

function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.id) {
    return (
      <div style={{ padding: 50 }}>
        <h2>No recent order found.</h2>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    );
  }

  const {
    id, total, delivery_type, delivery_address, delivery_city, delivery_pin,
    delivery_time_slot, date
  } = state;

  const isDelivery = delivery_type === "delivery";

  return (
    <div style={{ padding: 50, maxWidth: 520, margin: "170px auto" }}>
      <h2>Thank You For Your Order!</h2>
      <div style={{ marginTop: 24, marginBottom: 28, fontSize: "1.1rem", color: "#263548" }}>
        <div>Order Number: <strong>{id}</strong></div>
        <div>Total Paid: <strong>₹{Number(total).toFixed(2)}</strong></div>
        <div>Type: <strong>{isDelivery ? "Delivery" : "Pickup"}</strong></div>
        {isDelivery && (
          <div>
            Address: {delivery_address}, {delivery_city}, {delivery_pin}
          </div>
        )}
        <div>
          {isDelivery ? "Delivery" : "Pickup"} Time:{" "}
          <strong>
            {delivery_time_slot} on {formatDate(date)}
          </strong>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontSize: "1.07rem" }}>
        {isDelivery ? (
          <>Your order will be delivered by <strong>Sumit Verma</strong> by <strong>{delivery_time_slot} on {formatDate(date)}</strong>.</>
        ) : (
          <>Your order will be ready for <strong>pickup</strong> at <strong>{delivery_time_slot} on {formatDate(date)}</strong>.</>
        )}
      </div>
      <div style={{ fontSize: "1rem", color: "#207544" }}>
        A confirmation email has been sent to your registered email address.
      </div>
      <button
        style={{
          marginTop: 28,
          padding: "10px 24px",
          border: "none",
          borderRadius: "7px",
          background: "#226642",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "1rem"
        }}
        onClick={() => navigate("/")}
      >
        Return to Home
      </button>
    </div>
  );
}

export default OrderConfirmation;
