<?php
class BaseModel
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = Database::connection();
    }

    protected function getConnection()
    {
        return $this->pdo;
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
