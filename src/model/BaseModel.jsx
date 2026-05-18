import "./BaseModel.css";
export default class BaseModel {
  #id;
  _modelName = "BaseModel"; // protected-style field for subclasses

  constructor(data = {}) {
    this.#id = data.id ?? null;
  }
  get id() {
    return this.#id;
  }
  set id(value) {
    this.#id = value ?? null;
  }
  _string(value, fallback = "") {
    return value === undefined || value === null ? fallback : String(value);
  }
  _number(value, fallback = 0) {
    return Number(value ?? fallback);
  }
  _boolInt(value, fallback = 0) {
    return Number(value ?? fallback) === 1 ? 1 : 0;
  }
  getType() {
    return this._modelName;
  }
  getDisplayName() {
    return `${this.getType()} #${this.#id ?? "new"}`;
  }
  isValid() {
    return true;
  }

  toJSON() {
    return { id: this.#id };
  }
}
