import "./CustomerModel.css";
import UserModel from "./UserModel";

export default class CustomerModel extends UserModel {
  #phone;
  #address;

  constructor(data = {}) {
    super(data);
    this._modelName = "Customer";
    this.#phone = this._string(data.phone);
    this.#address = this._string(data.address);
  }

  get phone() { return this.#phone; }
  set phone(value) { this.#phone = this._string(value); }

  get address() { return this.#address; }
  set address(value) { this.#address = this._string(value); }

  getRoleLabel() { return "Customer"; }
  getDashboardRoute() { return "/home"; }
  canPlaceOrder() { return true; }

  toJSON() {
    return {
      ...super.toJSON(),
      phone: this.#phone,
      address: this.#address,
    };
  }
}
