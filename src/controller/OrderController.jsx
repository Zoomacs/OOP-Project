import { api } from "./ApiController";
import "./OrderController.css";

export default class OrderController {
  static checkout(payload) { return api("checkout", { method: "POST", body: JSON.stringify(payload) }); }
  static getUserOrders(userId) { return api(`orders&user_id=${userId}`); }
  static getRestaurantOrders(restaurantId) { return api(`restaurant-orders&restaurant_id=${restaurantId}`); }
  static updateStatus(payload) { return api("orders", { method: "PUT", body: JSON.stringify(payload) }); }
  static delete(id) { return api("orders", { method: "DELETE", body: JSON.stringify({ id }) }); }
}
