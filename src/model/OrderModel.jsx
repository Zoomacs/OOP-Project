import BaseModel from "./BaseModel";
import "./OrderModel.css";

export default class OrderModel extends BaseModel {
  #user_id;
  #restaurant_id;
  #total;
  #status;
  #payment_method;
  #payment_status;
  #items;
  constructor(data = {}) {
    super(data);
    this._modelName = "Order";
    this.#user_id = data.user_id ?? null;
    this.#restaurant_id = data.restaurant_id ?? null;
    this.#total = this._number(data.total ?? data.total_amount, 0);
    this.#status = this._string(data.status, "pending");
    this.#payment_method = this._string(data.payment_method, "cash");
    this.#payment_status = this._string(data.payment_status, "pending");
    this.#items = Array.isArray(data.items) ? data.items : [];
  }
  get user_id() {
    return this.#user_id;
  }
  set user_id(v) {
    this.#user_id = v ?? null;
  }
  get restaurant_id() {
    return this.#restaurant_id;
  }
  set restaurant_id(v) {
    this.#restaurant_id = v ?? null;
  }
  get total() {
    return this.#total;
  }
  set total(v) {
    this.#total = this._number(v, 0);
  }
  get status() {
    return this.#status;
  }
  set status(v) {
    this.#status = this._string(v, "pending");
  }
  get payment_method() {
    return this.#payment_method;
  }
  set payment_method(v) {
    this.#payment_method = this._string(v, "cash");
  }
  get payment_status() {
    return this.#payment_status;
  }
  set payment_status(v) {
    this.#payment_status = this._string(v, "pending");
  }
  get items() {
    return this.#items;
  }
  set items(v) {
    this.#items = Array.isArray(v) ? v : [];
  }
  isActive() {
    return !["completed", "cancelled", "delivered", "received"].includes(
      this.#status.toLowerCase(),
    );
  }
  getDisplayName() {
    return `Order #${this.id ?? "new"}`;
  }
  isValid() {
    return (
      this.#user_id !== null && this.#restaurant_id !== null && this.#total >= 0
    );
  }
  toJSON() {
    return {
      ...super.toJSON(),
      user_id: this.#user_id,
      restaurant_id: this.#restaurant_id,
      total: this.#total,
      status: this.#status,
      payment_method: this.#payment_method,
      payment_status: this.#payment_status,
      items: this.#items,
    };
  }
}
