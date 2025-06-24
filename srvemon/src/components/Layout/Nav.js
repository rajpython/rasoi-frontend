// src/components/Nav.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CartIndicator from '../CartIndicator/CartIndicator';
// import './Nav.css';
import "./HeaderNav.css"

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
            <li><Link to="/profile">Profile</Link></li>
            <li className="nav-user">
              <div>
                Welcome, {toTitleCase(user.first_name)}
                <div
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  (Log Out)
                </div>
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
