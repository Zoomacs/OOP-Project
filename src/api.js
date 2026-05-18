export const API_BASE = "http://localhost/oop-project/backend/api.php";

export async function api(route, options = {}) {
  const response = await fetch(`${API_BASE}?route=${route}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Backend request failed");
  }
  return data;
}

export function getUser() {
  const raw = sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
