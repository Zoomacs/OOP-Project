export default class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.email = data.email || "";
    this.identifier = data.identifier || data.university_id || "";
    this.role = data.role || "student";
    this.restaurant_id = data.restaurant_id || null;
    this.status = data.status || "active";
  }

  static fromApi(data) {
    return new UserModel(data || {});
  }

  isAdmin() { return this.role === "admin"; }
  isOwner() { return this.role === "owner"; }
  isStaff() { return this.role === "staff"; }
  isStudent() { return this.role === "student"; }
}
