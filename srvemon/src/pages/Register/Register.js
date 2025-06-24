



// File: src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import DemographicFormSection from "../../components/DemographicFormSection";
import { hundredYearsAgo } from "../../utils/dateUtils";
import "../../styles/FormStyles.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    dob: hundredYearsAgo(),
    gender: "T",
    city: "Hajipur",
    state: "Bihar",
    country: "India",
    marital_status: "N",
    education: "LL",
    income: "B",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      first_name,
      last_name,
      ...profile
    } = form;

    const payload = {
      username,
      email,
      password,
      first_name,
      last_name,
      profile,
    };

    try {
      await registerUser(payload);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-section">
        <h2>Register</h2>
        {error && <p className="form-error">{error}</p>}

        <fieldset className="account-section">
          <legend>Account Information</legend>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input name="first_name" placeholder="First Name" onChange={handleChange} value={form.first_name} required />
          <input name="last_name" placeholder="Last Name" onChange={handleChange} value={form.last_name} required />
        </fieldset>

        <p className="hint">
          Psst... unless 'A Transgender Centenarian from Hajipur' is your vibe,
          you might want to update these fields.
        </p>

        <DemographicFormSection form={form} handleChange={handleChange} />

        <button type="submit">Register</button>
      </form>

      <p className="redirect-link">
        Already have an account?{" "}
        <button onClick={() => navigate("/login")} className="text-link">
          Click here to log in
        </button>
      </p>
    </div>
  );
}

export default Register;
