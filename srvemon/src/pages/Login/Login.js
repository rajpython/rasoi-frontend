


// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { mergeGuestCartWithBackend } from "../../slices/cartSlice";
import "./Login.css";
import BASE_URL from "../../apiConfig";

function Login() {
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();

  // This will check if we're redirected here with a success message
  const resetMessage = location.state?.resetMessage;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser(form);
  
      const profileRes = await fetch(`${BASE_URL}/restaurante/me/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }
  
      const userData = await profileRes.json();
      login(userData, token);  // ✅ Send full user data to context
  
      await dispatch(mergeGuestCartWithBackend(token));
  
      navigate("/");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };
  

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {resetMessage && <p className="login-success">{resetMessage}</p>}
        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>

        {/* --- FORGOT PASSWORD LINK --- */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <button
            type="button"
            className="forgot-password-link"
            style={{
              background: "none",
              border: "none",
              color: "#0077cc",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.95em"
            }}
            onClick={() => navigate("/reset-password")}
          >
            Forgot password? Reset
          </button>
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="register-prompt">
          Not registered yet?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="register-link"
          >
            Click here to register
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;

