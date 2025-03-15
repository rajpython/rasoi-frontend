
// src/pages/BookingPage.js

import React from "react";
import BookingForm from "../components/BookingForm";

function BookingPage({ availableTimes, dispatch, submitForm }) {
    return (
      <section className="booking-page">
        {/* ✅ Enlarged text for emphasis */}
        <p style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          Fill out the form below to reserve a table.
        </p>
        
        {/* ✅ Pass down props correctly */}
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm}/>
      </section>
    );
}

export default BookingPage;
