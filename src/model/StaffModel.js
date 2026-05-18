import CustomerModel from "./CustomerModel";

export default class StaffModel extends CustomerModel {
  #discountRate;

  constructor(data = {}) {
    super({ ...data, role: "staff" });
    this._modelName = "Staff";
    this.#discountRate = this._number(data.discount_rate, 0);
  }

  get discount_rate() { return this.#discountRate; }
  set discount_rate(value) { this.#discountRate = this._number(value, 0); }

  getRoleLabel() { return "University Staff"; }
  getDashboardRoute() { return this.restaurant_id ? "/restaurant-dashboard" : "/home"; }
  canAccessOwner() { return Boolean(this.restaurant_id); }

  toJSON() {
    return { ...super.toJSON(), discount_rate: this.#discountRate };
  }
}
