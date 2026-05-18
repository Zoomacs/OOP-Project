<?php
require_once __DIR__ . '/User.php';

class Customer extends User
{
    private $phone;
    private $address;

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->phone = $this->stringValue($data['phone'] ?? '');
        $this->address = $this->stringValue($data['address'] ?? '');
    }

    public function getEntityName()
    {
        return 'Customer';
    }
    public function getRoleLabel()
    {
        return 'Customer';
    }
    public function getPhone()
    {
        return $this->phone;
    }
    public function setPhone($value)
    {
        $this->phone = $this->stringValue($value);
        return $this;
    }
    public function getAddress()
    {
        return $this->address;
    }
    public function setAddress($value)
    {
        $this->address = $this->stringValue($value);
        return $this;
    }
    public function toArray()
    {
        return array_merge(parent::toArray(), ['phone' => $this->phone, 'address' => $this->address]);
    }
}
