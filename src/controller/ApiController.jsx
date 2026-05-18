import "./ApiController.css";
export const API_BASE = "http://localhost/oop-project/backend/api.php";

class ApiController {
  static async request(route, options = {}) {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${API_BASE}?route=${route}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let payload = {};

    try {
      payload = text ? JSON.parse(text) : {};
    } catch (error) {
      throw new Error(text || "Backend did not return valid JSON");
    }

    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || "Backend request failed");
    }

    // Backend MVC views return { success, message, data: {...} }.
    // Most frontend pages expect the data keys directly, for example result.user or result.orders.
    // This keeps both formats working safely.
    if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
      return { ...payload, ...payload.data };
    }

    return payload;
  }
}

export async function api(route, options = {}) {
  return ApiController.request(route, options);
}

export default ApiController;
