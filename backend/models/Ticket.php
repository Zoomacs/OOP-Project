<?php
require_once __DIR__ . '/DomainModel.php';

class Ticket extends DomainModel
{
    private $user_id; private $subject; private $message; private $reply; private $status;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->user_id = $data['user_id'] ?? null;
        $this->subject = $this->stringValue($data['subject'] ?? $data['title'] ?? '');
        $this->message = $this->stringValue($data['message'] ?? '');
        $this->reply = $this->stringValue($data['reply'] ?? $data['admin_reply'] ?? '');
        $this->status = $this->stringValue($data['status'] ?? 'Open', 'Open');
    }
    public function getEntityName(){return 'Ticket';}
    public function getUserId(){return $this->user_id;} public function setUserId($value){$this->user_id=$value; return $this;}
    public function getSubject(){return $this->subject;} public function setSubject($value){$this->subject=$this->stringValue($value); return $this;}
    public function getMessage(){return $this->message;} public function setMessage($value){$this->message=$this->stringValue($value); return $this;}
    public function getReply(){return $this->reply;} public function setReply($value){$this->reply=$this->stringValue($value); return $this;}
    public function getStatus(){return $this->status;} public function setStatus($value){$this->status=$this->stringValue($value, 'Open'); return $this;}
    public function isAnswered(){return strtolower($this->status)==='answered' || $this->reply !== '';}
    public function getDisplayName(){return $this->subject ?: parent::getDisplayName();}
    public function isValid(){return $this->subject !== '' && $this->message !== '';}
    public function toArray(){return ['id'=>$this->id,'user_id'=>$this->user_id,'subject'=>$this->subject,'title'=>$this->subject,'message'=>$this->message,'reply'=>$this->reply,'admin_reply'=>$this->reply,'status'=>$this->status];}
}
