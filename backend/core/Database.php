<?php
class Database
{
    private static $pdo = null;

    public static function connection()
    {
        if (self::$pdo === null) {
            $config = require __DIR__ . '/../config.php';
            try {
                self::$pdo = new PDO(
                    "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4",
                    $config['user'],
                    $config['pass'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed',
                    'error' => $e->getMessage(),
                ]);
                exit;
            }
        }
        return self::$pdo;
    }
}
