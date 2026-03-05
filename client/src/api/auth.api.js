import { apiFetch } from "./http";

export function signup({ email, name, password }) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
}

export function login({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

export function me() {
  return apiFetch("/api/auth/me");
}