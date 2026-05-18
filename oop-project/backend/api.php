<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/RestaurantController.php';
require_once __DIR__ . '/controllers/TicketController.php';

$route  = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($route) {
    case 'login':
        if ($method === 'POST') (new UserController())->login();
        else methodNotAllowed();
        break;

    case 'register':
        if ($method === 'POST') (new UserController())->register();
        else methodNotAllowed();
        break;

    case 'restaurants':
        if ($method === 'GET') (new RestaurantController())->getAll();
        else methodNotAllowed();
        break;

    case 'menu':
        if ($method === 'GET') (new RestaurantController())->getMenu();
        else methodNotAllowed();
        break;

    case 'order-history':
        if ($method === 'GET') (new OrderController())->fetchUserOrderHistory();
        else methodNotAllowed();
        break;

    case 'order-track':
        if ($method === 'GET') (new OrderController())->fetchOrderTracking();
        else methodNotAllowed();
        break;

    case 'update-status':
        if ($method === 'POST') (new OrderController())->updateOrderStatus();
        else methodNotAllowed();
        break;

    case 'tickets':
        if ($method === 'GET')  (new TicketController())->getAll();
        elseif ($method === 'POST') (new TicketController())->submit();
        elseif ($method === 'PUT')  (new TicketController())->reply();
        else methodNotAllowed();
        break;

    case 'admin-users':
        if ($method === 'GET') (new UserController())->getAllUsers();
        elseif ($method === 'PUT') (new UserController())->updateStatus();
        else methodNotAllowed();
        break;

    case 'admin-analytics':
        if ($method === 'GET') (new UserController())->analytics();
        else methodNotAllowed();
        break;

    case 'admin-orders':
        if ($method === 'GET') (new OrderController())->getAllOrders();
        else methodNotAllowed();
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Route '$route' not found."]);
        break;
}

function methodNotAllowed() {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed."]);
}
?>
