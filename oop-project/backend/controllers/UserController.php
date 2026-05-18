<?php
// backend/controllers/UserController.php
require_once __DIR__ . '/../config/Database.php';

class UserController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // POST api.php?route=login
    public function login() {
        $data     = json_decode(file_get_contents("php://input"), true);
        $uni_id   = trim($data["id"]       ?? "");
        $password = trim($data["password"] ?? "");

        if (!$uni_id || !$password) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID and password required."]);
            return;
        }

        $stmt = $this->db->prepare(
            "SELECT user_id, name, type, password, status FROM users WHERE university_id = ?"
        );
        $stmt->execute([$uni_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user["password"])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid ID or password."]);
            return;
        }

        if ($user["status"] === "banned") {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Account suspended."]);
            return;
        }

        $customer_id   = null;
        $restaurant_id = null;

        if (in_array($user["type"], ["student", "staff"])) {
            $cs = $this->db->prepare("SELECT customer_id FROM customers WHERE user_id = ? LIMIT 1");
            $cs->execute([$user["user_id"]]);
            $c = $cs->fetch(PDO::FETCH_ASSOC);
            $customer_id = $c["customer_id"] ?? null;
        }

        if ($user["type"] === "owner") {
            $rs = $this->db->prepare("SELECT restaurant_id FROM restaurants WHERE owner_id = ? LIMIT 1");
            $rs->execute([$user["user_id"]]);
            $r = $rs->fetch(PDO::FETCH_ASSOC);
            $restaurant_id = $r["restaurant_id"] ?? null;
        }

        echo json_encode([
            "success"       => true,
            "user_id"       => $user["user_id"],
            "name"          => $user["name"],
            "role"          => $user["type"],
            "customer_id"   => $customer_id,
            "restaurant_id" => $restaurant_id,
        ]);
    }

    // POST api.php?route=register
    public function register() {
        $data     = json_decode(file_get_contents("php://input"), true);
        $name     = trim($data["fullName"]        ?? "");
        $uni_id   = trim($data["ID"]              ?? "");
        $email    = trim($data["universityEmail"] ?? "");
        $password = trim($data["password"]        ?? "");
        $type     = in_array($data["role"] ?? "", ["student","staff","owner","admin"])
                    ? $data["role"] : "student";

        if (!$name || !$uni_id || !$email || !$password) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "All fields required."]);
            return;
        }

        $hashed = password_hash($password, PASSWORD_DEFAULT);

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare(
                "INSERT INTO users (name, type, email, university_id, password) VALUES (?,?,?,?,?)"
            );
            $stmt->execute([$name, $type, $email, $uni_id, $hashed]);
            $new_id = $this->db->lastInsertId();

            if (in_array($type, ["student","staff"])) {
                $cs = $this->db->prepare("INSERT INTO customers (user_id, customer_type) VALUES (?,?)");
                $cs->execute([$new_id, $type]);
            }

            $this->db->commit();
            echo json_encode(["success" => true, "message" => "Registered successfully."]);

        } catch (PDOException $e) {
            $this->db->rollBack();
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "ID or email already exists."]);
        }
    }

    // GET api.php?route=admin-users[&role=student]
    public function getAllUsers() {
        $role = $_GET["role"] ?? "";
        if ($role) {
            $stmt = $this->db->prepare(
                "SELECT u.user_id, u.name AS full_name, u.email, u.type AS role, u.status,
                        COUNT(o.order_id) AS order_count,
                        COALESCE(SUM(o.total_price),0) AS total_spent
                 FROM users u
                 LEFT JOIN customers c ON u.user_id = c.user_id
                 LEFT JOIN orders o    ON c.customer_id = o.customer_id
                 WHERE u.type = ?
                 GROUP BY u.user_id ORDER BY u.name"
            );
            $stmt->execute([$role]);
        } else {
            $stmt = $this->db->query(
                "SELECT user_id, name AS full_name, email, type AS role, status FROM users ORDER BY name"
            );
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // PUT api.php?route=admin-users
    public function updateStatus() {
        $data   = json_decode(file_get_contents("php://input"), true);
        $id     = intval($data["id"]     ?? 0);
        $status = $data["status"]        ?? "";
        if (!$id || !in_array($status, ["active","banned"])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid id or status"]);
            return;
        }
        $stmt = $this->db->prepare("UPDATE users SET status = ? WHERE user_id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(["success" => true]);
    }

    // GET api.php?route=admin-analytics
    public function analytics() {
        $stats = [];
        $stats["total_users"]        = (int)$this->db->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $stats["active_restaurants"] = (int)$this->db->query("SELECT COUNT(*) FROM restaurants WHERE is_open = 1")->fetchColumn();
        $stats["orders_today"]       = (int)$this->db->query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()")->fetchColumn();
        $stats["open_tickets"]       = (int)$this->db->query("SELECT COUNT(*) FROM tickets WHERE status != 'resolved'")->fetchColumn();

        $activity = $this->db->query(
            "SELECT CONCAT('Order #', o.order_id, ' placed') AS action,
                    u.name AS user, 'Done' AS status
             FROM orders o JOIN customers c ON o.customer_id = c.customer_id
             JOIN users u ON c.user_id = u.user_id
             ORDER BY o.created_at DESC LIMIT 5"
        )->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["stats" => $stats, "recent_activity" => $activity]);
    }
}
?>
