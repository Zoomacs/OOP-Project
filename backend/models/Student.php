<?php
require_once __DIR__ . '/Customer.php';

class Student extends Customer
{
    private $points;
    public function __construct($data = [])
    {
        parent::__construct(array_merge($data, ['role' => 'student']));
        $this->points = max(0, $this->numberValue($data['points'] ?? 0));
    }
    public function getEntityName()
    {
        return 'Student';
    }
    public function getRoleLabel()
    {
        return 'Student';
    }
    public function getPoints()
    {
        return $this->points;
    }
    public function setPoints($value)
    {
        $this->points = max(0, $this->numberValue($value));
        return $this;
    }
    public function toArray()
    {
        return array_merge(parent::toArray(), ['points' => $this->points]);
    }
}
