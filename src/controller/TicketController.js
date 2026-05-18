import { api } from "./ApiController";

export default class TicketController {
  static create(payload) { return api("tickets", { method: "POST", body: JSON.stringify(payload) }); }
  static reply(payload) { return api("tickets", { method: "PUT", body: JSON.stringify(payload) }); }
  static delete(id) { return api("tickets", { method: "DELETE", body: JSON.stringify({ id }) }); }
}
