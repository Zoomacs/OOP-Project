<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/../controllers/AuthController.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$controller = new AuthController();
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    if ($action === 'login') {
        echo json_encode($controller->login($data));
    } elseif ($action === 'register') {
        echo json_encode($controller->register($data));
    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>