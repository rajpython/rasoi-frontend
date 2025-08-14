


// src/components/CheckoutForm.js

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import BASE_URL from "../apiConfig";
import { fetchWithAuth } from "../api/authApi";

function CheckoutForm({ orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create payment intent
      const intentRes = await fetchWithAuth(
        `${BASE_URL}/restaurante/api/create-payment-intent/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId })
        }
      );

      if (!intentRes.ok) throw new Error("Failed to create payment intent");

      const { client_secret } = await intentRes.json();

      // 2. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: cardElement }
      });

      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent.status !== "succeeded") throw new Error("Payment did not succeed");

      // 3. Show success message
      setSuccess(true);

      // 4. 🔔 Notify parent to trigger backend confirmation email
      if (onSuccess) await onSuccess();

    } catch (err) {
      setError("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <label>Card Details:</label>
      <CardElement className="card-element" />

      <button type="submit" disabled={!stripe || loading} className="confirm-btn">
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">🎉 Payment successful & email sent!</p>}
    </form>
  );
}

export default CheckoutForm;
