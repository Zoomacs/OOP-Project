<?php
// backend/login.php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data       = json_decode(file_get_contents("php://input"), true);
$uni_id     = trim($data["id"]       ?? "");
$password   = trim($data["password"] ?? "");

if (!$uni_id || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID and password are required."]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT user_id, name, type, password, status FROM users WHERE university_id = ?"
);
$stmt->bind_param("s", $uni_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid ID or password."]);
    exit();
}

if ($user["status"] === "banned") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Your account has been suspended."]);
    exit();
}

if (!password_verify($password, $user["password"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid ID or password."]);
    exit();
}

// For owners, also return their restaurant_id
$restaurant_id = null;
if ($user["type"] === "owner") {
    $rs = $conn->prepare("SELECT restaurant_id FROM restaurants WHERE owner_id = ? LIMIT 1");
    $rs->bind_param("i", $user["user_id"]);
    $rs->execute();
    $rRow = $rs->get_result()->fetch_assoc();
    $restaurant_id = $rRow["restaurant_id"] ?? null;
}

// For customers, also return their customer_id
$customer_id = null;
if ($user["type"] === "student" || $user["type"] === "staff") {
    $cs = $conn->prepare("SELECT customer_id FROM customers WHERE user_id = ? LIMIT 1");
    $cs->bind_param("i", $user["user_id"]);
    $cs->execute();
    $cRow = $cs->get_result()->fetch_assoc();
    $customer_id = $cRow["customer_id"] ?? null;
}

echo json_encode([
    "success"       => true,
    "user_id"       => $user["user_id"],
    "name"          => $user["name"],
    "role"          => $user["type"],
    "customer_id"   => $customer_id,
    "restaurant_id" => $restaurant_id,
]);

$conn->close();
?>
