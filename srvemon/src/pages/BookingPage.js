// src/pages/BookingPage.js

import React from "react";
import BookingForm from "../components/BookingForm";

// function BookingPage() {
//   return (
//     <section className="booking-page">
//       <h2>Reserve a Table</h2>
//       <p>Fill out the form below to reserve a table at Rasoi.</p>
//       <BookingForm />
//     </section>
//   );
// }

// export default BookingPage;


function BookingPage({ availableTimes, dispatch, submitForm }) {
    return (
      <section className="booking-page">
        <h2>Reserve a Table</h2>
        <p>Fill out the form below to reserve a table at Rasoi.</p>
        
        {/* Pass down props correctly */}
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm}/>
      </section>
    );
  }
  
export default BookingPage;