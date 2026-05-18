import "./RestaurantOwnerModel.css";
import UserModel from "./UserModel";

export default class RestaurantOwnerModel extends UserModel {
  constructor(data = {}) {
    super({ ...data, role: "owner" });
    this._modelName = "RestaurantOwner";
  }

  getRoleLabel() { return "Restaurant Owner"; }
  getDashboardRoute() { return "/owner"; }
  canAccessOwner() { return true; }
  canPlaceOrder() { return false; }
  isValid() { return super.isValid() && Boolean(this.restaurant_id); }
}
