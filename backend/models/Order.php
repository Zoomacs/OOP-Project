<?php
require_once __DIR__ . '/DomainModel.php';

class Order extends DomainModel
{
    private $user_id; private $restaurant_id; private $total; private $status; private $payment_method; private $payment_status; private $items;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->user_id = $data['user_id'] ?? null;
        $this->restaurant_id = $data['restaurant_id'] ?? null;
        $this->total = $this->numberValue($data['total'] ?? $data['total_amount'] ?? 0);
        $this->status = $this->stringValue($data['status'] ?? 'pending', 'pending');
        $this->payment_method = $this->stringValue($data['payment_method'] ?? 'cash', 'cash');
        $this->payment_status = $this->stringValue($data['payment_status'] ?? 'pending', 'pending');
        $this->items = is_array($data['items'] ?? null) ? $data['items'] : [];
    }
    public function getEntityName(){return 'Order';}
    public function getUserId(){return $this->user_id;} public function setUserId($value){$this->user_id=$value; return $this;}
    public function getRestaurantId(){return $this->restaurant_id;} public function setRestaurantId($value){$this->restaurant_id=$value; return $this;}
    public function getTotal(){return $this->total;} public function setTotal($value){$this->total=$this->numberValue($value); return $this;}
    public function getStatus(){return $this->status;} public function setStatus($value){$this->status=$this->stringValue($value, 'pending'); return $this;}
    public function getPaymentMethod(){return $this->payment_method;} public function setPaymentMethod($value){$this->payment_method=$this->stringValue($value, 'cash'); return $this;}
    public function getPaymentStatus(){return $this->payment_status;} public function setPaymentStatus($value){$this->payment_status=$this->stringValue($value, 'pending'); return $this;}
    public function getItems(){return $this->items;} public function setItems($value){$this->items=is_array($value)?$value:[]; return $this;}
    public function isActive(){return !in_array(strtolower($this->status), ['completed','cancelled','delivered','received']);}
    public function isValid(){return $this->user_id && $this->restaurant_id && $this->total >= 0;}
    public function toArray(){return ['id'=>$this->id,'user_id'=>$this->user_id,'restaurant_id'=>$this->restaurant_id,'total'=>$this->total,'status'=>$this->status,'payment_method'=>$this->payment_method,'payment_status'=>$this->payment_status,'items'=>$this->items];}
}
