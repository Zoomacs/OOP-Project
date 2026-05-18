<?php
require_once __DIR__ . '/../config/Database.php';

class RestaurantController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        $stmt = $this->db->query(
            "SELECT restaurant_id AS id, name, description, rating, reviews,
                    prep_time, is_open, staff_delivery, image_url
             FROM restaurants
             ORDER BY name"
        );

        $restaurants = array_map(function($r) {
            return [
                "id"            => (int)$r["id"],
                "name"          => $r["name"],
                "description"   => $r["description"] ?? "",
                "rating"        => (float)$r["rating"],
                "reviews"       => (int)$r["reviews"],
                "time"          => $r["prep_time"] ?? "15-20 min",
                "isOpen"        => (int)$r["is_open"] === 1,
                "staffDelivery" => (int)$r["staff_delivery"] === 1,
                "imageUrl"      => $r["image_url"] ?? "",
            ];
        }, $stmt->fetchAll());

        echo json_encode($restaurants);
    }

    public function getMenu() {
        $restaurant_id = intval($_GET["restaurant_id"] ?? 0);
        if (!$restaurant_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "restaurant_id is required."]);
            return;
        }

        $stmt = $this->db->prepare(
            "SELECT
                p.product_id,
                p.product_id AS id,
                p.product_name,
                p.product_name AS name,
                p.price,
                p.category,
                p.rating,
                p.description,
                p.picture,
                p.picture AS image_url,
                p.is_available,
                m.name AS menu_name
             FROM product_items p
             JOIN menus m ON p.menu_id = m.menu_id
             WHERE m.restaurant_id = ? AND p.is_available = 1
             ORDER BY m.name, p.product_name"
        );
        $stmt->execute([$restaurant_id]);
        echo json_encode($stmt->fetchAll());
    }
}
?>
