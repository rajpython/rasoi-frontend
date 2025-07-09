

// src/components/Nav.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CartIndicator from '../CartIndicator/CartIndicator';
import "./HeaderNav.css";

const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function Nav({ shrunk }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`nav${shrunk ? ' nav-shrunk' : ''}`}>
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/reservations">Reservations</Link></li>
        <li><Link to="/order-online">Order Online</Link></li>

        {user ? (
          <>
            {/* 🆕 Dropdown container */}
            <li className="dropdown">
              <span className="dropdown-title">{toTitleCase(user.first_name)}'s' Stuff</span>
              <ul className="dropdown-menu">
                <li><Link to="/my-reservations">Reservations</Link></li>
                <li><Link to="/my-orders">Orders</Link></li>
                <li><Link to="/my-reviews">Reviews</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </li>

            <li className="nav-user">
              <div className="nav-logout" onClick={handleLogout}>
                Log Out
              </div>
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
        <li><CartIndicator /></li>
      </ul>
    </nav>
  );
}

export default Nav;
