import BaseModel from "./BaseModel";

export default class NotificationModel extends BaseModel {
  #user_id; #title; #message; #is_read;
  constructor(data = {}) {
    super(data); this._modelName = "Notification";
    this.#user_id = data.user_id ?? null;
    this.#title = this._string(data.title);
    this.#message = this._string(data.message);
    this.#is_read = this._boolInt(data.is_read, 0);
  }
  get user_id(){return this.#user_id;} set user_id(v){this.#user_id=v??null;}
  get title(){return this.#title;} set title(v){this.#title=this._string(v);}
  get message(){return this.#message;} set message(v){this.#message=this._string(v);}
  get is_read(){return this.#is_read;} set is_read(v){this.#is_read=this._boolInt(v,0);}
  isUnread(){return this.#is_read===0;}
  markAsRead(){this.#is_read=1; return this;}
  getDisplayName(){return this.#title || super.getDisplayName();}
  isValid(){return this.#user_id!==null && this.#title!=="";}
  toJSON(){return {...super.toJSON(), user_id:this.#user_id, title:this.#title, message:this.#message, is_read:this.#is_read};}
}
