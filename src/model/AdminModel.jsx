import UserModel from "./UserModel";
import "./AdminModel.css";

export default class AdminModel extends UserModel {
  constructor(data = {}) {
    super({ ...data, role: "admin" });
    this._modelName = "Admin";
  }

  getRoleLabel() {
    return "Admin";
  }
  getDashboardRoute() {
    return "/admin";
  }
  canAccessAdmin() {
    return true;
  }
  canPlaceOrder() {
    return false;
  }
}
