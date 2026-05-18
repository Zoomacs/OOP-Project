import BaseModel from "./BaseModel";
import "./PaymentModel.css";

export default class PaymentModel extends BaseModel {
  #order_id;
  #amount;
  #method;
  #status;
  #screenshot_url;
  constructor(data = {}) {
    super(data);
    this._modelName = "Payment";
    this.#order_id = data.order_id ?? null;
    this.#amount = this._number(data.amount, 0);
    this.#method = this._string(data.method, "cash");
    this.#status = this._string(data.status, "pending");
    this.#screenshot_url = this._string(data.screenshot_url);
  }
  get order_id() {
    return this.#order_id;
  }
  set order_id(v) {
    this.#order_id = v ?? null;
  }
  get amount() {
    return this.#amount;
  }
  set amount(v) {
    this.#amount = this._number(v, 0);
  }
  get method() {
    return this.#method;
  }
  set method(v) {
    this.#method = this._string(v, "cash");
  }
  get status() {
    return this.#status;
  }
  set status(v) {
    this.#status = this._string(v, "pending");
  }
  get screenshot_url() {
    return this.#screenshot_url;
  }
  set screenshot_url(v) {
    this.#screenshot_url = this._string(v);
  }
  isApproved() {
    return (
      this.#status.toLowerCase() === "approved" ||
      this.#status.toLowerCase() === "paid"
    );
  }
  isValid() {
    return this.#order_id !== null && this.#amount >= 0;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      order_id: this.#order_id,
      amount: this.#amount,
      method: this.#method,
      status: this.#status,
      screenshot_url: this.#screenshot_url,
    };
  }
}
