
// const BASE_URL = "http://127.0.0.1:9100";
// const BASE_URL = process.env.REACT_APP_API_BASE_URL;

import BASE_URL from '../apiConfig';

// 🔹 Custom registration endpoint (with demographics)
export async function registerUser(formData) {
  const response = await fetch(`${BASE_URL}/restaurante/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.detail || Object.values(data)[0] || "Registration failed";
    throw new Error(errorMessage);
  }

  return data;
}

// 🔹 Djoser token-based login
export async function loginUser({ username, password }) {
  const response = await fetch(`${BASE_URL}/auth/token/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.detail || "Login failed";
    throw new Error(errorMessage);
  }

  return data.auth_token; // Standard Djoser token key
}

// 🔹 Optional: logout the user (invalidate token)

export async function logoutUser(token) {
  const response = await fetch(`${BASE_URL}/auth/token/logout/`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return true;
}

// Profie get and updates

export async function getProfile() {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${BASE_URL}/restaurante/me/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

export async function updateProfile(data) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${BASE_URL}/restaurante/me/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}
