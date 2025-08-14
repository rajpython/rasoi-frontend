

// src/pages/ChatbotOrderPage.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchWithAuth } from "../api/authApi";
import CheckoutForm from "../components/CheckoutForm";
import BASE_URL from "../apiConfig";
import "./CartPage/CartPage.css";
import { formatDate } from "../utils/dateUtils";

function ChatbotOrderPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [orderData, setOrderData] = useState(null);
  const [form, setForm] = useState({ address: "", city: "", pin: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/restaurante/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrderData(data);
        setForm({
          address: data.delivery_address || "",
          city: data.delivery_city || "",
          pin: data.delivery_pin || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetchWithAuth(`${BASE_URL}/restaurante/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_address: form.address,
          delivery_city: form.city,
          delivery_pin: form.pin,
        }),
      });
      if (!res.ok) throw new Error("Failed to update order address");
      const updated = await res.json();
      setOrderData(updated);
      alert("Address updated!");
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmOrderAndNotify = async () => {
    try {
      const res = await fetch(`${BASE_URL}/restaurante/orders/${orderId}/confirm/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to confirm order");
      const updated = await res.json();
      window.parent.postMessage(
        {
          type: "ORDER_CONFIRMED",
          order: updated,
        },
        "*"
      );
    } catch (err) {
      alert("\u26a0\ufe0f Order confirmed, but something went wrong: " + err.message);
    }
  };

  const handleStripeSuccess = async () => {
    await confirmOrderAndNotify();
  };
  

  const cancelOrderAndExit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/restaurante/orders/${orderId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to cancel order");
      const result = await res.json();  // ← includes { message: "Order #123 deleted." }
  
      // ✅ Inform the parent widget
      window.parent.postMessage(
        {
          type: "ORDER_CANCELLED",
          message: result.message, // this will be used to show in chat
        },
        "*"
      );
    } catch (err) {
      console.warn("Failed to delete order, but closing anyway");
      window.parent.postMessage(
        {
          type: "ORDER_CANCELLED",
          message: "⚠️ Order cancellation failed or partially succeeded.",
        },
        "*"
      );
    } finally {
      window.parent.postMessage("CLOSE_IFRAME", "*");
    }
  };
  

  if (error) return <div className="cart-container"><p>{error}</p></div>;
  if (!orderData) return <div className="cart-container"><p>Loading your order...</p></div>;

  const total = parseFloat(orderData.total || 0).toFixed(2);

  return (
    <div className="cart-container">
      <h2>Your चाटGPT Order</h2>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderData.orderitem.map((item, idx) => (
            <tr key={idx}>
              <td>{item.menuitem.title}</td>
              <td>{item.quantity}</td>
              <td>₹{Number(item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-totals">
        <div className="total-row">Total: ₹{total}</div>
        <div>Delivery Date: {formatDate(orderData.date)}</div>
        <div>Time Slot: {orderData.delivery_time_slot}</div>
        <div>Payment: {orderData.payment_method}</div>
      </div>

      {orderData.delivery_type?.toLowerCase() === "delivery" && (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <h4>Delivery Address</h4>
          <input name="address" placeholder="Street" value={form.address} onChange={handleChange} required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="pin" placeholder="PIN Code" value={form.pin} onChange={handleChange} required />
          <button className="remove-btn" type="submit" style={{ marginTop: 12 }}>Update Address</button>
        </form>
      )}

      {orderData.payment_method?.toLowerCase() === "stripe" && (
        <div style={{ marginTop: 24 }}>
          <h4>Confirm and Pay Now</h4>
          <CheckoutForm orderId={orderId} onSuccess={handleStripeSuccess} />
        </div>
      )}

      {orderData.payment_method?.toLowerCase() === "cod" && (
        <div style={{ marginTop: 24 }}>
          <button className="remove-btn" onClick={confirmOrderAndNotify}>Confirm Your Order</button>
        </div>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: "12px" }}>
        <button className="remove-btn" onClick={cancelOrderAndExit}>
          Cancel Order / Back to ChaatGPT
        </button>
      </div>
    </div>
  );
}

export default ChatbotOrderPage;

