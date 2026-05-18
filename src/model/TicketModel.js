export default class TicketModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.subject = data.subject || "";
    this.message = data.message || "";
    this.reply = data.reply || "";
    this.status = data.status || "open";
  }
}
