


// src/Main.js
import React, { useReducer, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import MenuPage from "./pages/MenuPage";
import ConfirmedBooking from "./pages/ConfirmedBooking";
import { fetchAPI, submitAPI } from "./api";  

// Function to initialize available times
export const initializeTimes = () => {
  const today = new Date();
  return fetchAPI(today);
};

// export const initializeTimes = () => {
//     const today = new Date();
//     const times = fetchAPI(today);
//     return Array.isArray(times) ? times : []; // ✅ Ensure it returns an array
// };
  

// Reducer function to update times when a new date is selected
export const timesReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TIMES":
      console.log("Reducer received action:", action);
      const times = fetchAPI(new Date(action.payload));
      console.log("fetchAPI returned:", times);
      return times;
    default:
      return state;
  }
};

function Main() {
  const [availableTimes, dispatch] = useReducer(timesReducer, initializeTimes());
  const [reservationData, setReservationData] = useState(null); // ✅ Store reservation details
  const navigate = useNavigate(); 

  // ✅ Function to submit the form and navigate to the confirmation page
  const submitForm = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      setReservationData(formData); // ✅ Store reservation details
      navigate("/confirmation");  // ✅ Redirect to confirmation page
    }
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reservations" element={<BookingPage availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} />} />
      <Route path="/menu" element={<MenuPage />} />
      {/* ✅ Pass reservationData to the confirmation page */}
      <Route path="/confirmation" element={<ConfirmedBooking reservationData={reservationData} />} />
    </Routes>
  );
}

export default Main;
