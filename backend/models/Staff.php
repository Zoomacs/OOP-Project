<?php
require_once __DIR__ . '/Customer.php';

class Staff extends Customer
{
    private $discountRate;
    public function __construct($data = [])
    {
        parent::__construct(array_merge($data, ['role' => 'staff']));
        $this->discountRate = $this->numberValue($data['discount_rate'] ?? 0);
    }
    public function getEntityName() { return 'Staff'; }
    public function getRoleLabel() { return 'University Staff'; }
    public function getDashboardRoute() { return $this->getRestaurantId() ? '/restaurant-dashboard' : '/home'; }
    public function canAccessOwner() { return (bool)$this->getRestaurantId(); }
    public function getDiscountRate() { return $this->discountRate; }
    public function setDiscountRate($value) { $this->discountRate = $this->numberValue($value); return $this; }
    public function toArray() { return array_merge(parent::toArray(), ['discount_rate' => $this->discountRate]); }
}
