import apiFetch from "./apiClient";

export async function register(data: { name?: string; email: string; password: string }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: data,
  });
}

export async function login(data: { email: string; password: string }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: data,
  });
}

export async function getProfile() {
  return apiFetch("/api/auth/profile");
}

export async function getMyOrders() {
  return apiFetch("/api/auth/my-orders");
}

export default { register, login, getProfile, getMyOrders };
