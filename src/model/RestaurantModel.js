import BaseModel from "./BaseModel";

export default class RestaurantModel extends BaseModel {
  #owner_id; #name; #category; #description; #image_url; #status;
  constructor(data = {}) {
    super(data); this._modelName = "Restaurant";
    this.#owner_id = data.owner_id ?? data.owner_user_id ?? null;
    this.#name = this._string(data.name);
    this.#category = this._string(data.category);
    this.#description = this._string(data.description);
    this.#image_url = this._string(data.image_url);
    this.#status = this._string(data.status, data.is_open === 0 ? "closed" : "open");
  }
  get owner_id() { return this.#owner_id; } set owner_id(v) { this.#owner_id = v ?? null; }
  get name() { return this.#name; } set name(v) { this.#name = this._string(v); }
  get category() { return this.#category; } set category(v) { this.#category = this._string(v); }
  get description() { return this.#description; } set description(v) { this.#description = this._string(v); }
  get image_url() { return this.#image_url; } set image_url(v) { this.#image_url = this._string(v); }
  get status() { return this.#status; } set status(v) { this.#status = this._string(v, "open"); }
  isOpen() { return this.#status.toLowerCase() === "open" || this.#status === "1"; }
  getDisplayName() { return this.#name || super.getDisplayName(); }
  isValid() { return this.#name !== ""; }
  toJSON() { return { ...super.toJSON(), owner_id:this.#owner_id, name:this.#name, category:this.#category, description:this.#description, image_url:this.#image_url, status:this.#status }; }
}
