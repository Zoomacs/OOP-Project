<?php
// backend/register.php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data       = json_decode(file_get_contents("php://input"), true);
$name       = trim($data["fullName"]        ?? "");
$uni_id     = trim($data["ID"]              ?? "");
$email      = trim($data["universityEmail"] ?? "");
$password   = trim($data["password"]        ?? "");
$type       = in_array($data["role"] ?? "", ["student","staff","owner","admin"])
              ? $data["role"] : "student";

if (!$name || !$uni_id || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email address."]);
    exit();
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

$conn->begin_transaction();

try {
    // Insert into users
    $stmt = $conn->prepare(
        "INSERT INTO users (name, type, email, university_id, password) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssss", $name, $type, $email, $uni_id, $hashed);
    $stmt->execute();
    $new_user_id = $conn->insert_id;

    // If student or staff → also create a customers row so orders work
    if ($type === "student" || $type === "staff") {
        $cstmt = $conn->prepare(
            "INSERT INTO customers (user_id, customer_type) VALUES (?, ?)"
        );
        $cstmt->bind_param("is", $new_user_id, $type);
        $cstmt->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Registered successfully."]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "ID or email already exists.",
    ]);
}

$conn->close();
?>
