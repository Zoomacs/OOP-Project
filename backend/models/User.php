<?php
require_once __DIR__ . '/DomainModel.php';

class User extends DomainModel
{
    private $name;
    private $email;
    private $university_id;
    private $role;
    private $status;
    private $restaurant_id;

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->name = $this->stringValue($data['name'] ?? '');
        $this->email = $this->stringValue($data['email'] ?? '');
        $this->university_id = $this->stringValue($data['university_id'] ?? $data['identifier'] ?? '');
        $this->role = strtolower($this->stringValue($data['role'] ?? 'student', 'student'));
        $this->status = $this->stringValue($data['status'] ?? 'Active', 'Active');
        $this->restaurant_id = $data['restaurant_id'] ?? null;
    }

    public function getEntityName()
    {
        return 'User';
    }
    public function getName()
    {
        return $this->name;
    }
    public function setName($value)
    {
        $this->name = $this->stringValue($value);
        return $this;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public function setEmail($value)
    {
        $this->email = $this->stringValue($value);
        return $this;
    }
    public function getUniversityId()
    {
        return $this->university_id;
    }
    public function setUniversityId($value)
    {
        $this->university_id = $this->stringValue($value);
        return $this;
    }
    public function getRole()
    {
        return $this->role;
    }
    public function setRole($value)
    {
        $this->role = strtolower($this->stringValue($value, 'student'));
        return $this;
    }
    public function getStatus()
    {
        return $this->status;
    }
    public function setStatus($value)
    {
        $this->status = $this->stringValue($value, 'Active');
        return $this;
    }
    public function getRestaurantId()
    {
        return $this->restaurant_id;
    }
    public function setRestaurantId($value)
    {
        $this->restaurant_id = $value;
        return $this;
    }

    public function isActive()
    {
        return strtolower($this->status) === 'active';
    }
    public function canAccessAdmin()
    {
        return false;
    }
    public function canAccessOwner()
    {
        return false;
    }
    public function canPlaceOrder()
    {
        return true;
    }
    public function getDashboardRoute()
    {
        return '/home';
    }
    public function getRoleLabel()
    {
        return 'User';
    }
    public function getDisplayName()
    {
        return $this->name ?: parent::getDisplayName();
    }
    public function isValid()
    {
        return $this->university_id !== '' && $this->role !== '';
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'university_id' => $this->university_id,
            'identifier' => $this->university_id,
            'role' => $this->role,
            'status' => $this->status,
            'restaurant_id' => $this->restaurant_id,
            'role_label' => $this->getRoleLabel(),
            'dashboard_route' => $this->getDashboardRoute(),
        ];
    }
}
