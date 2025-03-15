// src/pages/HomePage.js
import React from 'react';
import CallToAction from '../components/CallToAction';
import Specials from '../components/Specials';
import CustomersSay from '../components/CustomersSay';
import Ames from '../components/Ames';

function HomePage() {
  return (
    <main className="main-content">
      <CallToAction />
      
      {/* "Order Online" button can appear here if you like */}
      <div className="order-online-container">
        <button className="order-online">Order Online</button>
      </div>
      
      <Specials />

      <CustomersSay />
      <Ames />
    </main>
  );
}

export default HomePage;
