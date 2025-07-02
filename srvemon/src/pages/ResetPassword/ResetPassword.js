

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import "../Login/Login.css"; // ✅ reuse same style sheet as Login

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${BASE_URL}/auth/users/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 204) {
        setSuccessMessage("If this email is registered, a password reset link has been sent.");
        return;
      }

      const contentType = res.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Unexpected server response.");
      }

      throw new Error(
        data.email?.[0] || data.detail || "Could not process your request."
      );

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Reset Password</h2>

        {successMessage && <p className="login-success">{successMessage}</p>}
        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Registered Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Send Reset Link</button>

        <p className="register-prompt">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="register-link"
          >
            Go back to Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
