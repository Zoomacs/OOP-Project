import BaseModel from "./BaseModel";
import "./MenuItemModel.css";

export default class MenuItemModel extends BaseModel {
  #restaurant_id; #name; #description; #price; #category; #image_url; #is_available;
  constructor(data = {}) {
    super(data); this._modelName = "MenuItem";
    this.#restaurant_id = data.restaurant_id ?? null;
    this.#name = this._string(data.name);
    this.#description = this._string(data.description);
    this.#price = this._number(data.price, 0);
    this.#category = this._string(data.category);
    this.#image_url = this._string(data.image_url);
    this.#is_available = this._boolInt(data.is_available, 1);
  }
  get restaurant_id() { return this.#restaurant_id; } set restaurant_id(v) { this.#restaurant_id = v ?? null; }
  get name() { return this.#name; } set name(v) { this.#name = this._string(v); }
  get description() { return this.#description; } set description(v) { this.#description = this._string(v); }
  get price() { return this.#price; } set price(v) { this.#price = this._number(v, 0); }
  get category() { return this.#category; } set category(v) { this.#category = this._string(v); }
  get image_url() { return this.#image_url; } set image_url(v) { this.#image_url = this._string(v); }
  get is_available() { return this.#is_available; } set is_available(v) { this.#is_available = this._boolInt(v, 1); }
  isAvailable() { return this.#is_available === 1; }
  getDisplayName() { return this.#name || super.getDisplayName(); }
  isValid() { return this.#restaurant_id !== null && this.#name !== "" && this.#price > 0; }
  toJSON() { return { ...super.toJSON(), restaurant_id:this.#restaurant_id, name:this.#name, description:this.#description, price:this.#price, category:this.#category, image_url:this.#image_url, is_available:this.#is_available }; }
}
