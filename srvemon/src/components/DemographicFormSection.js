

// File: src/components/DemographicFormSection.js
import React from "react";

function DemographicFormSection({ form, handleChange }) {
  return (
    <fieldset className="profile-section">
      <legend>Profile Details</legend>

      <label>
        Date of Birth:
        <input type="date" name="dob" value={form.dob} onChange={handleChange} />
      </label>

      <label>
        Gender:
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="B">Bisexual</option>
          <option value="T">Transgender</option>
        </select>
      </label>

      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
      <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />

      <label>
        Marital Status:
        <select name="marital_status" value={form.marital_status} onChange={handleChange}>
          <option value="M">Married</option>
          <option value="U">Unmarried</option>
          <option value="N">Not Applicable</option>
        </select>
      </label>

      <label>
        Education:
        <select name="education" value={form.education} onChange={handleChange}>
          <option value="LL">Likh Lodha Padh Patthar</option>
          <option value="BH">Below High School</option>
          <option value="HS">High School</option>
          <option value="BS">Bachelor’s Degree</option>
          <option value="GD">Graduate Degree</option>
        </select>
      </label>

      <label>
        Income Range:
        <select name="income" value={form.income} onChange={handleChange}>
          <option value="B">Bhikhari</option>
          <option value="L">Below $100K</option>
          <option value="M">$100K–$200K</option>
          <option value="H">Above $200K</option>
        </select>
      </label>

      <label>
        Phone Number:
        <input
          type="tel"
          name="phone"
          placeholder="Phone (e.g. +919876543210)"
          value={form.phone}
          onChange={handleChange}
          pattern="^\+?\d{9,15}$"
          title="Please enter a valid phone number with at least 9 digits and optional '+' country code."
          required
        />
      </label>
    </fieldset>
  );
}

export default DemographicFormSection;

