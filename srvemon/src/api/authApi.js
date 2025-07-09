import BASE_URL from '../apiConfig';

// ---- Register user ----
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

// ---- JWT login ----
export async function loginUser({ username, password }) {
  const response = await fetch(`${BASE_URL}/auth/jwt/create/`, {
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

  // Save tokens to localStorage (or return them for context to store)
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);

  return { access: data.access, refresh: data.refresh };
}

// ---- JWT logout ----
export async function logoutUser() {
  // For JWT, you typically just remove tokens from storage.
  // If using blacklist, POST to blacklist endpoint as well.
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return true;
}

// ---- Token refresh utility ----
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");
  const response = await fetch(`${BASE_URL}/auth/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to refresh token");
  }
  localStorage.setItem("accessToken", data.access);
  return data.access;
}

// ---- Authenticated fetch helper ----
export async function fetchWithAuth(url, options = {}, retry = true) {
  let accessToken = localStorage.getItem("accessToken");
  let headers = options.headers || {};
  headers["Authorization"] = `Bearer ${accessToken}`;
  options.headers = headers;

  let response = await fetch(url, options);

  if (response.status === 401 && retry) {
    // Try refreshing the token and retry request once
    try {
      accessToken = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${accessToken}`;
      response = await fetch(url, options);
    } catch (err) {
      throw new Error("Session expired. Please log in again.");
    }
  }
  return response;
}

// ---- Profile get/update ----
export async function getProfile() {
  const res = await fetchWithAuth(`${BASE_URL}/restaurante/me/`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

export async function updateProfile(data) {
  const res = await fetchWithAuth(`${BASE_URL}/restaurante/me/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}
