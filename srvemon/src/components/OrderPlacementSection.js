import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import BASE_URL from "../apiConfig";

// function getTodayYYYYMMDD() {
//   const d = new Date();
//   return d.toISOString().split("T")[0];
// }

function getTodayYYYYMMDD() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


function isSlotPastNow(selectedDate, slot) {
  if (slot === "ASAP") return false;
  const today = getTodayYYYYMMDD();
  if (selectedDate !== today) return false;
  const now = new Date();
  const [h, m] = slot.split(":").map(Number);
  const slotDate = new Date();
  slotDate.setHours(h, m, 0, 0);
  return slotDate <= now;
}

function OrderPlacementSection({ total, onOrderPlaced }) {
  const [form, setForm] = useState({
    deliveryType: "delivery",
    address: "",
    city: "",
    pin: "",
    date: getTodayYYYYMMDD(),
    timeSlot: "ASAP",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");  // NEW
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch(`${BASE_URL}/restaurante/orders/available-time-slots/`);
        const data = await res.json();
        setAvailableSlots(data.time_slots || []);
        const today = getTodayYYYYMMDD();
        let firstAvailable = data.time_slots && data.time_slots.length > 0 ? data.time_slots[0] : "";
        if (form.date !== today && firstAvailable === "ASAP") {
          firstAvailable = data.time_slots.length > 1 ? data.time_slots[1] : "";
        }
        setForm((f) => ({
          ...f,
          timeSlot: firstAvailable
        }));
      } catch {
        setAvailableSlots([]);
      }
    }
    fetchSlots();
  }, [form.date]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (paymentMethod === "stripe") {
      // Stripe payment flow
      try {
        const intentRes = await fetch(`${BASE_URL}/restaurante/api/create-payment-intent/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!intentRes.ok) throw new Error("Failed to create payment intent");
        const { client_secret } = await intentRes.json();

        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: { card: cardElement },
        });

        if (stripeError) throw new Error(stripeError.message);
        if (paymentIntent.status !== "succeeded") throw new Error("Payment did not succeed");

        await createOrder("stripe", "paid", accessToken);
      } catch (err) {
        setError("Payment failed: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Pay on delivery / pickup
      await createOrder("cod", "pending", accessToken);
      setLoading(false);
    }
  };

  async function createOrder(method, status, accessToken) {
    try {
      const payload = {
        delivery_type: form.deliveryType,
        delivery_address: form.deliveryType === "delivery" ? form.address : "",
        delivery_city: form.deliveryType === "delivery" ? form.city : "",
        delivery_pin: form.deliveryType === "delivery" ? form.pin : "",
        delivery_time_slot: form.timeSlot,
        date: form.date,
        payment_method: method,
        payment_status: status,
        is_confirmed: true,
      };
      const res = await fetch(`${BASE_URL}/restaurante/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to place order");
      const orderData = await res.json();
      dispatch(clearCart());
      localStorage.removeItem("guest_cart");
      onOrderPlaced(orderData);
    } catch (err) {
      setError("Order failed: " + err.message);
    }
  }

  const today = getTodayYYYYMMDD();
  const slotsForDisplay = form.date === today
    ? availableSlots
    : availableSlots.filter((slot) => slot !== "ASAP");

  return (
    <form className="order-section" onSubmit={handleSubmit} style={{ marginTop: 32 }}>
      <h3>Place Your Order</h3>

      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          /> Pay at Pickup / Delivery
        </label>
        <label style={{ marginLeft: 24 }}>
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          /> Pay Now with Card
        </label>
      </div>

      <label>
        Date:
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={today}
          required
          style={{ marginLeft: 8, marginBottom: 10 }}
        />
      </label>

      <div style={{ marginBottom: 18 }}>
        <label>
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={form.deliveryType === "delivery"}
            onChange={handleChange}
          /> Delivery
        </label>
        <label style={{ marginLeft: 24 }}>
          <input
            type="radio"
            name="deliveryType"
            value="pickup"
            checked={form.deliveryType === "pickup"}
            onChange={handleChange}
          /> Pickup
        </label>
      </div>

      {form.deliveryType === "delivery" && (
        <div className="order-form-fields">
          <input name="address" type="text" placeholder="Street Address" value={form.address} onChange={handleChange} required />
          <input name="city" type="text" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="pin" type="text" placeholder="PIN / Zipcode" value={form.pin} onChange={handleChange} required />
        </div>
      )}

      <div style={{ margin: "18px 0" }}>
        <label>
          Preferred Time:&nbsp;
          <select name="timeSlot" value={form.timeSlot} onChange={handleChange} required>
            <option value="">Select a time</option>
            {slotsForDisplay.length > 0 ? (
              slotsForDisplay.map((slot) => {
                const disabled = isSlotPastNow(form.date, slot);
                return (
                  <option key={slot} value={slot} disabled={disabled}>
                    {slot} {disabled ? "(Unavailable)" : ""}
                  </option>
                );
              })
            ) : (
              <option disabled>No available times</option>
            )}
          </select>
        </label>
      </div>

      {/* {paymentMethod === "stripe" && (
        <div style={{ marginBottom: 20 }}>
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      )} */}

      {paymentMethod === "stripe" && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "12px 14px",
            borderRadius: "8px",
            marginBottom: "20px",
            background: "#fafafa",
            transition: "border 0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.border = "1px solid #666")}
          onBlur={(e) => (e.currentTarget.style.border = "1px solid #ccc")}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": {
                    color: "#999",
                  },
                },
                invalid: {
                  color: "#e5424d",
                  iconColor: "#e5424d",
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 10, marginBottom: 18 }}>
        <strong>Total: ₹{total.toFixed(2)}</strong>
      </div>

      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

      <button type="submit" className="remove-btn" disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}

export default OrderPlacementSection;
