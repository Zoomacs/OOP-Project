import { api } from "./ApiController";

export default class NotificationController {
  static getForUser(userId) { return api(`notifications&user_id=${userId}`); }
  static markRead(id) { return api("notifications", { method: "PUT", body: JSON.stringify({ id, is_read: 1 }) }); }
}
