<?php
require_once __DIR__ . '/DomainModel.php';

class MenuItem extends DomainModel
{
    private $restaurant_id;
    private $name;
    private $description;
    private $price;
    private $category;
    private $image_url;
    private $is_available;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->restaurant_id = $data['restaurant_id'] ?? null;
        $this->name = $this->stringValue($data['name'] ?? '');
        $this->description = $this->stringValue($data['description'] ?? '');
        $this->price = $this->numberValue($data['price'] ?? 0);
        $this->category = $this->stringValue($data['category'] ?? '');
        $this->image_url = $this->stringValue($data['image_url'] ?? '');
        $this->is_available = $this->boolIntValue($data['is_available'] ?? 1, 1);
    }
    public function getEntityName()
    {
        return 'MenuItem';
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
    public function getName()
    {
        return $this->name;
    }
    public function setName($value)
    {
        $this->name = $this->stringValue($value);
        return $this;
    }
    public function getDescription()
    {
        return $this->description;
    }
    public function setDescription($value)
    {
        $this->description = $this->stringValue($value);
        return $this;
    }
    public function getPrice()
    {
        return $this->price;
    }
    public function setPrice($value)
    {
        $this->price = $this->numberValue($value);
        return $this;
    }
    public function getCategory()
    {
        return $this->category;
    }
    public function setCategory($value)
    {
        $this->category = $this->stringValue($value);
        return $this;
    }
    public function getImageUrl()
    {
        return $this->image_url;
    }
    public function setImageUrl($value)
    {
        $this->image_url = $this->stringValue($value);
        return $this;
    }
    public function getIsAvailable()
    {
        return $this->is_available;
    }
    public function setIsAvailable($value)
    {
        $this->is_available = $this->boolIntValue($value, 1);
        return $this;
    }
    public function isAvailable()
    {
        return (int) $this->is_available === 1;
    }
    public function getDisplayName()
    {
        return $this->name ?: parent::getDisplayName();
    }
    public function isValid()
    {
        return $this->restaurant_id && $this->name !== '' && $this->price > 0;
    }
    public function toArray()
    {
        return ['id' => $this->id, 'restaurant_id' => $this->restaurant_id, 'name' => $this->name, 'description' => $this->description, 'price' => $this->price, 'category' => $this->category, 'image_url' => $this->image_url, 'is_available' => $this->is_available];
    }
}
