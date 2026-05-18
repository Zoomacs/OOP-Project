import BaseModel from "./BaseModel";

export default class TicketModel extends BaseModel {
  #user_id; #subject; #message; #reply; #status;
  constructor(data = {}) {
    super(data); this._modelName = "Ticket";
    this.#user_id = data.user_id ?? null;
    this.#subject = this._string(data.subject ?? data.title);
    this.#message = this._string(data.message);
    this.#reply = this._string(data.reply ?? data.admin_reply);
    this.#status = this._string(data.status, "Open");
  }
  get user_id(){return this.#user_id;} set user_id(v){this.#user_id=v??null;}
  get subject(){return this.#subject;} set subject(v){this.#subject=this._string(v);}
  get title(){return this.#subject;} set title(v){this.#subject=this._string(v);}
  get message(){return this.#message;} set message(v){this.#message=this._string(v);}
  get reply(){return this.#reply;} set reply(v){this.#reply=this._string(v);}
  get admin_reply(){return this.#reply;} set admin_reply(v){this.#reply=this._string(v);}
  get status(){return this.#status;} set status(v){this.#status=this._string(v,"Open");}
  isAnswered(){return this.#status.toLowerCase()==="answered" || this.#reply !== "";}
  getDisplayName(){return this.#subject || super.getDisplayName();}
  isValid(){return this.#subject!=="" && this.#message!=="";}
  toJSON(){return {...super.toJSON(), user_id:this.#user_id, subject:this.#subject, title:this.#subject, message:this.#message, reply:this.#reply, admin_reply:this.#reply, status:this.#status};}
}
