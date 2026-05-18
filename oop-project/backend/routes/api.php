<?php
// backend/routes/api.php

// 1. Allow React to communicate with PHP (CORS headers)
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle Preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Require the necessary controllers (Updated path since we are inside the 'routes' folder)
require_once __DIR__ . '/../controllers/OrderController.php';

// 3. Get the requested route from the URL
$route = isset($_GET['route']) ? $_GET['route'] : '';
$requestMethod = $_SERVER["REQUEST_METHOD"];

// 4. Route the request to the correct controller method
switch ($route) {
    case 'order-history':
        if ($requestMethod == 'GET') {
            $controller = new OrderController();
            $controller->fetchUserOrderHistory();
        }
        break;

    case 'order-track':
        if ($requestMethod == 'GET') {
            $controller = new OrderController();
            $controller->fetchOrderTracking();
        }
        break;

    case 'restaurant-orders':
        if ($requestMethod == 'GET') {
            $controller = new OrderController();
            $controller->fetchRestaurantOrders();
        }
        break;

    case 'update-status':
        if ($requestMethod == 'POST') {
            $controller = new OrderController();
            $controller->updateOrderStatus();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "API Route not found."]);
        break;
}
?>