export default class BaseModel {
  #id;
  _modelName = "BaseModel"; // protected-style field for subclasses

  constructor(data = {}) {
    this.#id = data.id ?? null;
  }

  // public getter/setter
  get id() { return this.#id; }
  set id(value) { this.#id = value ?? null; }

  // protected-style helpers for subclasses
  _string(value, fallback = "") { return value === undefined || value === null ? fallback : String(value); }
  _number(value, fallback = 0) { return Number(value ?? fallback); }
  _boolInt(value, fallback = 0) { return Number(value ?? fallback) === 1 ? 1 : 0; }

  // polymorphic methods: subclasses override these
  getType() { return this._modelName; }
  getDisplayName() { return `${this.getType()} #${this.#id ?? "new"}`; }
  isValid() { return true; }

  toJSON() {
    return { id: this.#id };
  }
}
