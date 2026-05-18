import CustomerModel from "./CustomerModel";
import "./StudentModel.css";

export default class StudentModel extends CustomerModel {
  #points;

  constructor(data = {}) {
    super({ ...data, role: "student" });
    this._modelName = "Student";
    this.#points = this._number(data.points, 0);
  }

  get points() {
    return this.#points;
  }
  set points(value) {
    this.#points = Math.max(0, this._number(value, 0));
  }

  getRoleLabel() {
    return "Student";
  }
  getDashboardRoute() {
    return "/home";
  }

  toJSON() {
    return { ...super.toJSON(), points: this.#points };
  }
}
