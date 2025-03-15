import React from 'react';
import logo from '../assets/Logo.svg';


function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Rasoi Logo" className="logo" />
        <h1 className="site-title">Rasoi</h1>
      </div>
      {/* Example: Add a "Reserve" button or tagline on the right side */}
      <div className="header-right">
        <button className="reserve-button">Reserve a Table</button>
      </div>
    </header>
  );
}

export default Header;