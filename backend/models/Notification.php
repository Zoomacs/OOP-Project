<?php
require_once __DIR__ . '/DomainModel.php';

class Notification extends DomainModel
{
    private $user_id; private $title; private $message; private $is_read;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->user_id = $data['user_id'] ?? null;
        $this->title = $this->stringValue($data['title'] ?? '');
        $this->message = $this->stringValue($data['message'] ?? '');
        $this->is_read = $this->boolIntValue($data['is_read'] ?? 0);
    }
    public function getEntityName(){return 'Notification';}
    public function getUserId(){return $this->user_id;} public function setUserId($value){$this->user_id=$value; return $this;}
    public function getTitle(){return $this->title;} public function setTitle($value){$this->title=$this->stringValue($value); return $this;}
    public function getMessage(){return $this->message;} public function setMessage($value){$this->message=$this->stringValue($value); return $this;}
    public function getIsRead(){return $this->is_read;} public function setIsRead($value){$this->is_read=$this->boolIntValue($value); return $this;}
    public function isUnread(){return (int)$this->is_read === 0;}
    public function markAsRead(){ $this->is_read = 1; return $this; }
    public function getDisplayName(){return $this->title ?: parent::getDisplayName();}
    public function isValid(){return $this->user_id && $this->title !== '';}
    public function toArray(){return ['id'=>$this->id,'user_id'=>$this->user_id,'title'=>$this->title,'message'=>$this->message,'is_read'=>$this->is_read];}
}
