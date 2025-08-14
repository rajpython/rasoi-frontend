
// src/hooks/useOrderContext.js

import { useEffect, useState } from "react";
import BASE_URL from "../apiConfig";

function useOrderContext(orderId) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !orderId) {
        setError("Missing access token or order ID.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/restaurante/orders/${orderId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Could not load order.");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchOrder();
  }, [orderId]);

  return { order, error };
}

export default useOrderContext;
