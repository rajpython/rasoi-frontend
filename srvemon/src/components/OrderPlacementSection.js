
// src/components/OrderPlacementSection.js

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice"; // <-- import clearCart
import BASE_URL from "../apiConfig";


function getTodayYYYYMMDD() {
  const d = new Date();
  return d.toISOString().split("T")[0];
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);
  const dispatch = useDispatch();


  // Fetch slots when component mounts or date changes
  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch(`${BASE_URL}/restaurante/orders/available-time-slots/`);
        const data = await res.json();
        setAvailableSlots(data.time_slots || []);
        // If ASAP is not allowed for this date, set to first time slot
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
    // eslint-disable-next-line
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
    try {
      const payload = {
        delivery_type: form.deliveryType,
        delivery_address: form.deliveryType === "delivery" ? form.address : "",
        delivery_city: form.deliveryType === "delivery" ? form.city : "",
        delivery_pin: form.deliveryType === "delivery" ? form.pin : "",
        delivery_time_slot: form.timeSlot,
        date: form.date,
      };
      const res = await fetch(`${BASE_URL}/restaurante/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to place order");
      const orderData = await res.json();
      dispatch(clearCart());                     // Clear Redux cart state
      localStorage.removeItem("guest_cart");     // Clear guest cart from storage
      onOrderPlaced(orderData);
    } catch (err) {
      setError("Order failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = getTodayYYYYMMDD();

  // Filter out ASAP for future dates
  const slotsForDisplay =
    form.date === today
      ? availableSlots
      : availableSlots.filter((slot) => slot !== "ASAP");

  return (
    <form className="order-section" onSubmit={handleSubmit} style={{ marginTop: 32 }}>
      <h3>Place Your Order</h3>
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
          <input
            name="address"
            type="text"
            placeholder="Street Address"
            value={form.address}
            onChange={handleChange}
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="pin"
            type="text"
            placeholder="PIN / Zipcode"
            value={form.pin}
            onChange={handleChange}
            required
            style={{ marginRight: 8 }}
          />
        </div>
      )}
      <div style={{ margin: "18px 0" }}>
        <label>
          Preferred Time:&nbsp;
          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
          >
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
      <div style={{ marginTop: 10, marginBottom: 18 }}>
        <strong>Total: ₹{total.toFixed(2)}</strong>
      </div>
      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
      <button type="submit" className="remove-btn" disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}

export default OrderPlacementSection;
