export default class OrderModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.restaurant_id = data.restaurant_id || null;
    this.total = Number(data.total || 0);
    this.status = data.status || "pending";
    this.payment_method = data.payment_method || "cash";
    this.payment_status = data.payment_status || "pending";
    this.items = data.items || [];
  }

  isActive() { return !["completed", "cancelled", "delivered"].includes(this.status); }
}
