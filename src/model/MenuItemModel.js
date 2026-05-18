export default class MenuItemModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.restaurant_id = data.restaurant_id || null;
    this.name = data.name || "";
    this.description = data.description || "";
    this.price = Number(data.price || 0);
    this.category = data.category || "";
    this.image_url = data.image_url || "";
    this.is_available = Number(data.is_available ?? 1);
  }

  isAvailable() { return this.is_available === 1; }
}
