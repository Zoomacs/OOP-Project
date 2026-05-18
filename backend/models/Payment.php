<?php
require_once __DIR__ . '/DomainModel.php';

class Payment extends DomainModel
{
    private $order_id;
    private $amount;
    private $method;
    private $status;
    private $screenshot_url;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->order_id = $data['order_id'] ?? null;
        $this->amount = $this->numberValue($data['amount'] ?? 0);
        $this->method = $this->stringValue($data['method'] ?? 'cash', 'cash');
        $this->status = $this->stringValue($data['status'] ?? 'pending', 'pending');
        $this->screenshot_url = $this->stringValue($data['screenshot_url'] ?? '');
    }
    public function getEntityName()
    {
        return 'Payment';
    }
    public function getOrderId()
    {
        return $this->order_id;
    }
    public function setOrderId($value)
    {
        $this->order_id = $value;
        return $this;
    }
    public function getAmount()
    {
        return $this->amount;
    }
    public function setAmount($value)
    {
        $this->amount = $this->numberValue($value);
        return $this;
    }
    public function getMethod()
    {
        return $this->method;
    }
    public function setMethod($value)
    {
        $this->method = $this->stringValue($value, 'cash');
        return $this;
    }
    public function getStatus()
    {
        return $this->status;
    }
    public function setStatus($value)
    {
        $this->status = $this->stringValue($value, 'pending');
        return $this;
    }
    public function getScreenshotUrl()
    {
        return $this->screenshot_url;
    }
    public function setScreenshotUrl($value)
    {
        $this->screenshot_url = $this->stringValue($value);
        return $this;
    }
    public function isApproved()
    {
        return in_array(strtolower($this->status), ['approved', 'paid']);
    }
    public function isValid()
    {
        return $this->order_id && $this->amount >= 0;
    }
    public function toArray()
    {
        return ['id' => $this->id, 'order_id' => $this->order_id, 'amount' => $this->amount, 'method' => $this->method, 'status' => $this->status, 'screenshot_url' => $this->screenshot_url];
    }
}
