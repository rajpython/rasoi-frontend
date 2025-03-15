
// src/components/CallToAction.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate for navigation
import restaurantFood from '../assets/restauranfood.jpg'; // Adjust path as needed

function CallToAction() {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Rasoi</h1>
        <h2>Ames</h2>
        <p>
          We are a family-owned Indian restaurant, focused on 
          traditional recipes served with a modern twist.
        </p>
        {/* ✅ Button navigates to /reservations */}
        <button onClick={() => navigate('/reservations')} aria-label="Reserve a Table">
          Reserve a Table
        </button>
      </div>
      <img
        src={restaurantFood}
        alt="Delicious Indian food"
        className="hero-image"
      />
    </section>
  );
}

export default CallToAction;
