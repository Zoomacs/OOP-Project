<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

spl_autoload_register(function ($class) {
    $folders = ['core', 'models', 'views', 'controllers'];
    foreach ($folders as $folder) {
        $file = __DIR__ . '/' . $folder . '/' . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

function input_json()
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

try {
    $router = new Router($_GET['route'] ?? '', $_SERVER['REQUEST_METHOD'], input_json());
    $router->dispatch();
} catch (Throwable $e) {
    $pdo = Database::connection();
    if ($pdo->inTransaction()) $pdo->rollBack();
    (new ErrorView())->serverError($e->getMessage());
}
