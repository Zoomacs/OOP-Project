import { api } from "./ApiController";

export default class RestaurantController {
  static getAll() { return api("restaurants"); }
  static getByOwner(ownerId) { return api(`owner-restaurant&owner_id=${ownerId}`); }
  static create(payload) { return api("restaurants", { method: "POST", body: JSON.stringify(payload) }); }
  static update(payload) { return api("restaurants", { method: "PUT", body: JSON.stringify(payload) }); }
  static delete(id) { return api("restaurants", { method: "DELETE", body: JSON.stringify({ id }) }); }
}
