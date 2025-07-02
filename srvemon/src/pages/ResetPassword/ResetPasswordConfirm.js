// src/pages/ResetPasswordConfirm.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import "./ResetPasswordConfirm.css";


function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: "", re_new_password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.new_password !== form.re_new_password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/users/reset_password_confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          new_password: form.new_password,
          re_new_password: form.re_new_password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.new_password?.[0] || data.token?.[0] || data.detail || "Reset failed."
        );
      }
      setSuccess("Your password has been reset. You can now log in.");
      setTimeout(() => navigate("/login"), 2500); // Go to login page after 2.5s
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reset-password-confirm-page">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>
        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            name="new_password"
            required
            value={form.new_password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="re-new-password">Confirm New Password</label>
          <input
            id="re-new-password"
            type="password"
            name="re_new_password"
            required
            value={form.re_new_password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="login-button">
          Set Password
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordConfirm;
