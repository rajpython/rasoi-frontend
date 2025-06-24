
// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.svg';
import "./HeaderNav.css"

function Header({ shrunk }) {
  const navigate = useNavigate();

  return (
    <header className={`header${shrunk ? ' header-shrunk' : ''}`}>
      <div className="header-left">
        <img src={logo} alt="Rasoi Logo" className="logo" />
        <h1 className="site-title">🐴 Dhanno Banno 👧🏽 ki Rasoi</h1>
      </div>
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

