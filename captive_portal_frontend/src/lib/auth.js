import axios from "axios";

export const API_BASE_URL = "/api";

export function getStoredAuth() {
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return { token, role, user };
  } catch {
    return { token: null, role: null, user: null };
  }
}

export function saveAuthSession({ token, role, user }) {
  if (!token) return;

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("user", JSON.stringify(user || {}));
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

export function isAuthenticated(role) {
  const { token, role: storedRole } = getStoredAuth();
  return Boolean(token) && (!role || storedRole === role);
}

export function apiClient() {
  const { token } = getStoredAuth();

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });
}
