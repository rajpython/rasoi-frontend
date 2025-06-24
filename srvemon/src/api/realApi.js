// src/realApi.js

import BASE_URL from '../apiConfig';

export async function fetchAPI(date) {
    try {
      const response = await fetch(`${BASE_URL}/restaurante/booking/available-times/?date=${date.toISOString().split("T")[0]}`);
      if (!response.ok) throw new Error("Failed to fetch available times");
      const data = await response.json();
      return data.times || []; // expected: { times: ["17:00", "17:30", ...] }
    } catch (error) {
      console.error("Error fetching times:", error);
      return [];
    }
  }
  
  export async function submitAPI(formData) {
    try {
      const response = await fetch(`${BASE_URL}/restaurante/booking/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      return response.ok;
    } catch (error) {
      console.error("Error submitting reservation:", error);
      return false;
    }
  }
  