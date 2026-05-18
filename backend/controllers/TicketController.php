<?php
// backend/controllers/TicketController.php
require_once __DIR__ . '/../config/Database.php';

class TicketController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // GET api.php?route=tickets
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM tickets ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // POST api.php?route=tickets
    public function submit() {
        $data    = json_decode(file_get_contents("php://input"), true);
        $user_id = intval($data["user_id"] ?? 0) ?: null;
        $email   = trim($data["user_email"] ?? "");
        $title   = trim($data["title"]      ?? "");
        $message = trim($data["message"]    ?? "");

        if (!$title || !$message) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Title and message required."]);
            return;
        }

        $stmt = $this->db->prepare(
            "INSERT INTO tickets (user_id, user_email, title, message) VALUES (?,?,?,?)"
        );
        $stmt->execute([$user_id, $email, $title, $message]);
        echo json_encode(["success" => true, "message" => "Ticket submitted."]);
    }

    // PUT api.php?route=tickets
    public function reply() {
        $data   = json_decode(file_get_contents("php://input"), true);
        $id     = intval($data["ticket_id"] ?? 0);
        $status = $data["status"]           ?? "";
        $reply  = $data["reply"]            ?? null;

        $stmt = $this->db->prepare(
            "UPDATE tickets SET status = ?, reply = ? WHERE ticket_id = ?"
        );
        $stmt->execute([$status, $reply, $id]);
        echo json_encode(["success" => true]);
    }
}
?>
