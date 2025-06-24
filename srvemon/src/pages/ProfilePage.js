
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/authApi";
import DemographicFormSection from "../components/DemographicFormSection";


function ProfilePage() {
  const [form, setForm] = useState({
    id: "",
    username: "",
    email: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    marital_status: "",
    education: "",
    income: ""
  });

//   const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(data => {
        setForm({
        //   id: data.id,
        //   username: data.username,
          email: data.email,
          ...data.profile
        });
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, ...profile } = form;

    const payload = {
        email,
      profile
    };


    // try {
    //   await updateProfile(payload);
    //   setMessage("Profile updated successfully!");
    //   setError("");
    // } catch (err) {
    //   setError("Failed to update profile.");
    //   setMessage("");
    // }

    try {
        await updateProfile(payload);
        alert("Profile updated successfully!");
        navigate("/"); // redirect to homepage
      } catch (err) {
        setError("Failed to update profile.");
      }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-section">
        <h2>Edit Your Profile</h2>
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        {/* {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>} */}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <p className="hint">
           Please update your perssonal information. Rest assured, it is all secure.
        </p>

        <DemographicFormSection form={form} handleChange={handleChange} />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProfilePage;
