import AdminModel from "./AdminModel";
import RestaurantOwnerModel from "./RestaurantOwnerModel";
import StaffModel from "./StaffModel";
import StudentModel from "./StudentModel";
import UserModel from "./UserModel";
import "./UserFactoryModel.css";

export default class UserFactoryModel {
  static create(data = {}) {
    const role = (data?.role || "student").toLowerCase();
    if (role === "admin") return new AdminModel(data);
    if (role === "owner") return new RestaurantOwnerModel(data);
    if (role === "staff") return new StaffModel(data);
    if (role === "student") return new StudentModel(data);
    return new UserModel(data);
  }
}
