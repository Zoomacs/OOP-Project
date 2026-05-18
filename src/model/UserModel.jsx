import BaseModel from "./BaseModel";
import "./UserModel.css";
export default class UserModel extends BaseModel {
  #name;
  #email;
  #identifier;
  #role;
  #restaurant_id;
  #status;

  constructor(data = {}) {
    super(data);
    this._modelName = "User";
    this.#name = this._string(data.name);
    this.#email = this._string(data.email);
    this.#identifier = this._string(data.identifier ?? data.university_id);
    this.#role = this._string(data.role, "student").toLowerCase();
    this.#restaurant_id = data.restaurant_id ?? null;
    this.#status = this._string(data.status, "Active");
  }

  get name() { return this.#name; }
  set name(value) { this.#name = this._string(value); }

  get email() { return this.#email; }
  set email(value) { this.#email = this._string(value); }

  get identifier() { return this.#identifier; }
  set identifier(value) { this.#identifier = this._string(value); }

  get university_id() { return this.#identifier; }
  set university_id(value) { this.#identifier = this._string(value); }

  get role() { return this.#role; }
  set role(value) { this.#role = this._string(value, "student").toLowerCase(); }

  get restaurant_id() { return this.#restaurant_id; }
  set restaurant_id(value) { this.#restaurant_id = value ?? null; }

  get status() { return this.#status; }
  set status(value) { this.#status = this._string(value, "Active"); }

  static fromApi(data) {
    return new UserModel(data || {});
  }
  getRoleLabel() { return "User"; }
  getDashboardRoute() { return "/home"; }
  canAccessAdmin() { return false; }
  canAccessOwner() { return false; }
  canPlaceOrder() { return true; }

  isAdmin() { return this.#role === "admin"; }
  isOwner() { return this.#role === "owner"; }
  isStaff() { return this.#role === "staff"; }
  isStudent() { return this.#role === "student"; }
  isActive() { return this.#status.toLowerCase() === "active"; }
  isValid() { return this.#identifier !== "" && this.#role !== ""; }
  getDisplayName() { return this.#name || this.#identifier || super.getDisplayName(); }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      email: this.#email,
      identifier: this.#identifier,
      university_id: this.#identifier,
      role: this.#role,
      restaurant_id: this.#restaurant_id,
      status: this.#status,
      role_label: this.getRoleLabel(),
      dashboard_route: this.getDashboardRoute(),
    };
  }
}
