<?php
class BaseModel
{
    protected $pdo;

    public function __construct()
    {
        $this->pdo = Database::connection();
    }

    public function query($sql, $params = [])
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function lastInsertId()
    {
        return $this->pdo->lastInsertId();
    }
}
