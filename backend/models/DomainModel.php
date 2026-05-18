<?php
require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/Arrayable.php';

abstract class DomainModel extends BaseModel implements Arrayable
{
    protected $id;
    private $originalData;

    public function __construct($data = [])
    {
        parent::__construct();
        $this->originalData = is_array($data) ? $data : [];
        $this->id = $data['id'] ?? null;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($value)
    {
        $this->id = $value;
        return $this;
    }

    protected function stringValue($value, $default = '')
    {
        return $value === null || $value === '' ? $default : trim((string)$value);
    }

    protected function numberValue($value, $default = 0)
    {
        return is_numeric($value) ? $value + 0 : $default;
    }

    protected function boolIntValue($value, $default = 0)
    {
        if ($value === null || $value === '') return $default;
        return ($value === true || $value === 1 || $value === '1' || $value === 'true') ? 1 : 0;
    }

    protected function getOriginalValue($key, $default = null)
    {
        return $this->originalData[$key] ?? $default;
    }
    abstract public function getEntityName();
    public function getDisplayName()
    {
        return $this->getEntityName() . ' #' . ($this->id ?? 'new');
    }

    public function isValid()
    {
        return true;
    }
}
