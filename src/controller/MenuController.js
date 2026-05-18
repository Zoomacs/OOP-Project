import { api, API_BASE } from "./ApiController";

export default class MenuController {
  static getByRestaurant(restaurantId) { return api(`menu&restaurant_id=${restaurantId}`); }
  static create(formData) { return fetch(`${API_BASE}?route=menu`, { method: "POST", body: formData }).then(r => r.json()); }
  static update(formData) { return fetch(`${API_BASE}?route=menu`, { method: "POST", body: formData }).then(r => r.json()); }
  static delete(id) { return api("menu", { method: "DELETE", body: JSON.stringify({ id }) }); }
}
