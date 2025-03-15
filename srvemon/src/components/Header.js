
// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate for navigation
import logo from '../assets/Logo.svg';

function Header() {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Rasoi Logo" className="logo" />
        <h1 className="site-title">Rasoi</h1>
      </div>
      {/* ✅ Button navigates to /reservations */}
      <div className="header-right">
        <button 
          className="reserve-button" 
          onClick={() => navigate('/reservations')} 
          aria-label="Reserve a Table"
        >
          Reserve a Table
        </button>
      </div>
    </header>
  );
}

export default Header;
