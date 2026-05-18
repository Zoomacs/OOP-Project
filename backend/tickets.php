<?php
// backend/tickets.php
require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];

// ── POST — submit a new support ticket ───────────────────────
if ($method === "POST") {
    $data    = json_decode(file_get_contents("php://input"), true);
    $user_id = intval($data["user_id"] ?? 0) ?: null;
    $email   = trim($data["user_email"] ?? "");
    $title   = trim($data["title"]      ?? "");
    $message = trim($data["message"]    ?? "");

    if (!$title || !$message) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Title and message required."]);
        exit();
    }

    $stmt = $conn->prepare(
        "INSERT INTO tickets (user_id, user_email, title, message) VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param("isss", $user_id, $email, $title, $message);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Ticket submitted."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to save ticket."]);
    }
    $conn->close();
    exit();
}

// ── GET — list all tickets (admin) ───────────────────────────
if ($method === "GET") {
    $result  = $conn->query("SELECT * FROM tickets ORDER BY created_at DESC");
    $tickets = [];
    while ($row = $result->fetch_assoc()) $tickets[] = $row;
    echo json_encode($tickets);
    $conn->close();
    exit();
}

// ── PUT — admin replies / changes status ─────────────────────
if ($method === "PUT") {
    $data   = json_decode(file_get_contents("php://input"), true);
    $id     = intval($data["ticket_id"] ?? 0);
    $status = $data["status"]           ?? "";
    $reply  = $data["reply"]            ?? null;

    $stmt = $conn->prepare("UPDATE tickets SET status = ?, reply = ? WHERE ticket_id = ?");
    $stmt->bind_param("ssi", $status, $reply, $id);
    $stmt->execute();
    echo json_encode(["success" => true]);
    $conn->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>
