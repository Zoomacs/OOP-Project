<?php
require_once __DIR__ . '/DomainModel.php';

class Restaurant extends DomainModel
{
    private $owner_id;
    private $name;
    private $category;
    private $description;
    private $image_url;
    private $status;
    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->owner_id = $data['owner_id'] ?? $data['owner_user_id'] ?? null;
        $this->name = $this->stringValue($data['name'] ?? '');
        $this->category = $this->stringValue($data['category'] ?? '');
        $this->description = $this->stringValue($data['description'] ?? '');
        $this->image_url = $this->stringValue($data['image_url'] ?? '');
        $this->status = $this->stringValue($data['status'] ?? ((isset($data['is_open']) && (int) $data['is_open'] === 0) ? 'closed' : 'open'), 'open');
    }
    public function getEntityName()
    {
        return 'Restaurant';
    }
    public function getOwnerId()
    {
        return $this->owner_id;
    }
    public function setOwnerId($value)
    {
        $this->owner_id = $value;
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
    public function getCategory()
    {
        return $this->category;
    }
    public function setCategory($value)
    {
        $this->category = $this->stringValue($value);
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
    public function getImageUrl()
    {
        return $this->image_url;
    }
    public function setImageUrl($value)
    {
        $this->image_url = $this->stringValue($value);
        return $this;
    }
    public function getStatus()
    {
        return $this->status;
    }
    public function setStatus($value)
    {
        $this->status = $this->stringValue($value, 'open');
        return $this;
    }
    public function isOpen()
    {
        return strtolower($this->status) === 'open' || $this->status === '1';
    }
    public function getDisplayName()
    {
        return $this->name ?: parent::getDisplayName();
    }
    public function isValid()
    {
        return $this->name !== '';
    }
    public function toArray()
    {
        return ['id' => $this->id, 'owner_id' => $this->owner_id, 'name' => $this->name, 'category' => $this->category, 'description' => $this->description, 'image_url' => $this->image_url, 'status' => $this->status];
    }
}
