import { api } from "./ApiController";

export default class AdminController {
  static users() { return api("users"); }
  static restaurants() { return api("restaurants"); }
  static orders() { return api("admin-orders"); }
  static payments() { return api("payments"); }
  static tickets() { return api("tickets"); }
  static stats() { return api("admin-stats"); }
}
