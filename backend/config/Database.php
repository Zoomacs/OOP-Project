<?php
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        $host = 'localhost';
        $db   = 'q-less_food_ordering_platform';
        $user = 'root';
        $pass = '';

        try {
            $this->connection = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
            exit();
        }
    }

    public static function getInstance() {
        if (!self::$instance) self::$instance = new Database();
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}
?>
