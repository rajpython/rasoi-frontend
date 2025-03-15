// src/components/CallToAction.js
import React from 'react';
import restaurantFood from '../assets/restauranfood.jpg'; // adjust path as needed

function CallToAction() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Rasoi</h1>
        <h2>Ames</h2>
        <p>
          We are a family owned Indian restaurant, focused on 
          traditional recipes served with a modern twist.
        </p>
        <button>Reserve a Table</button>
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
