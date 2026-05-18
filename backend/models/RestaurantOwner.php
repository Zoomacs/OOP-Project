<?php
require_once __DIR__ . '/User.php';

class RestaurantOwner extends User
{
    public function __construct($data = []) { parent::__construct(array_merge($data, ['role' => 'owner'])); }
    public function getEntityName() { return 'RestaurantOwner'; }
    public function getRoleLabel() { return 'Restaurant Owner'; }
    public function getDashboardRoute() { return '/owner'; }
    public function canAccessOwner() { return true; }
    public function canPlaceOrder() { return false; }
    public function isValid() { return parent::isValid() && (bool)$this->getRestaurantId(); }
}
