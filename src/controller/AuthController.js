import { api } from "./ApiController";
import UserModel from "../model/UserModel";

export default class AuthController {
  static async login(identifier, password) {
    const result = await api("login", {
      method: "POST",
      body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() }),
    });

    const userData = result.user || result.data?.user;
    if (!userData || !userData.role) {
      throw new Error(result.message || "Login failed. Please check the ID and password.");
    }

    return UserModel.fromApi(userData);
  }

  static async register(payload) {
    return api("register", { method: "POST", body: JSON.stringify(payload) });
  }

  static saveSession(user) {
    if (!user || !user.role) {
      throw new Error("Cannot save login session because user data is missing.");
    }

    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("userRole", user.role);
    sessionStorage.setItem("userId", user.id);

    if (user.restaurant_id) {
      sessionStorage.setItem("restaurantId", user.restaurant_id);
    } else {
      sessionStorage.removeItem("restaurantId");
    }
  }

  static getCurrentUser() {
    const raw = sessionStorage.getItem("user");
    return raw ? UserModel.fromApi(JSON.parse(raw)) : null;
  }

  static logout() {
    sessionStorage.clear();
  }
}
