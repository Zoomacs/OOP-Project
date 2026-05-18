<?php
require_once __DIR__ . '/Admin.php';
require_once __DIR__ . '/Student.php';
require_once __DIR__ . '/Staff.php';
require_once __DIR__ . '/RestaurantOwner.php';

class UserFactory
{
    public static function create($data = [])
    {
        $role = strtolower(trim($data['role'] ?? 'student'));
        if ($role === 'admin') return new Admin($data);
        if ($role === 'owner') return new RestaurantOwner($data);
        if ($role === 'staff') return new Staff($data);
        return new Student($data);
    }
}
