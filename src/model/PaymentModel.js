export default class PaymentModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.order_id = data.order_id || null;
    this.amount = Number(data.amount || 0);
    this.method = data.method || "cash";
    this.status = data.status || "pending";
    this.screenshot_url = data.screenshot_url || "";
  }
}
