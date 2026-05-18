<?php
require_once __DIR__ . '/User.php';

class Admin extends User
{
    public function __construct($data = [])
    {
        parent::__construct(array_merge($data, ['role' => 'admin']));
    }
    public function getEntityName()
    {
        return 'Admin';
    }
    public function getRoleLabel()
    {
        return 'Admin';
    }
    public function getDashboardRoute()
    {
        return '/admin';
    }
    public function canAccessAdmin()
    {
        return true;
    }
    public function canPlaceOrder()
    {
        return false;
    }
}
