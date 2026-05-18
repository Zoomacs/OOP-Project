export default class RestaurantModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.owner_id = data.owner_id || null;
    this.name = data.name || "";
    this.category = data.category || "";
    this.description = data.description || "";
    this.image_url = data.image_url || "";
    this.status = data.status || "open";
  }

  isOpen() { return this.status === "open"; }
}
