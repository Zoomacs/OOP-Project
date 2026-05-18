export default class NotificationModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.title = data.title || "";
    this.message = data.message || "";
    this.is_read = Number(data.is_read || 0);
  }

  isUnread() { return this.is_read === 0; }
}
