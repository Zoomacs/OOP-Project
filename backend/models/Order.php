<?php
require_once __DIR__ . '/../config/Database.php';

class Order {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getHistoryByCustomerId($customer_id) {
        $stmt = $this->db->prepare(
            "SELECT DISTINCT
                    o.order_id,
                    o.total_price,
                    o.status,
                    o.created_at,
                    o.item_quantity,
                    r.name AS restaurant_name,
                    r.image_url
             FROM orders o
             LEFT JOIN cart_items ci    ON o.cart_id = ci.cart_id
             LEFT JOIN product_items pi ON ci.product_id = pi.product_id
             LEFT JOIN menus m          ON pi.menu_id = m.menu_id
             LEFT JOIN restaurants r    ON m.restaurant_id = r.restaurant_id
             WHERE o.customer_id = ?
             ORDER BY o.created_at DESC"
        );
        $stmt->execute([$customer_id]);
        return $stmt->fetchAll();
    }

    public function getHistoryByRestaurantId($restaurant_id) {
        $stmt = $this->db->prepare(
            "SELECT DISTINCT
                    o.order_id,
                    o.total_price,
                    o.status,
                    o.created_at,
                    o.item_quantity,
                    u.name AS customer_name,
                    r.name AS restaurant_name,
                    r.image_url
             FROM orders o
             JOIN customers c      ON o.customer_id = c.customer_id
             JOIN users u          ON c.user_id = u.user_id
             JOIN cart_items ci    ON o.cart_id = ci.cart_id
             JOIN product_items pi ON ci.product_id = pi.product_id
             JOIN menus m          ON pi.menu_id = m.menu_id
             JOIN restaurants r    ON m.restaurant_id = r.restaurant_id
             WHERE r.restaurant_id = ?
             ORDER BY o.created_at DESC"
        );
        $stmt->execute([$restaurant_id]);
        return $stmt->fetchAll();
    }

    public function getOrderDetails($order_id) {
        $stmt = $this->db->prepare(
            "SELECT o.order_id, o.status, o.total_price, o.created_at, o.note,
                    d.delivery_status, d.location,
                    p.payment_status, p.payment_type
             FROM orders o
             LEFT JOIN deliveries d ON o.delivery_id = d.delivery_id
             LEFT JOIN payments   p ON o.order_id    = p.order_id
             WHERE o.order_id = ?"
        );
        $stmt->execute([$order_id]);
        return $stmt->fetch();
    }

    public function updateStatus($order_id, $status) {
        $status  = strtolower(trim($status));
        $allowed = ['pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
        return $stmt->execute([$status, $order_id]);
    }

    public function getAllWithDetails() {
        $stmt = $this->db->query(
            "SELECT DISTINCT
                 o.order_id,
                 o.total_price,
                 o.status,
                 o.created_at,
                 u.name AS customer_name,
                 r.name AS restaurant_name,
                 p.payment_status,
                 p.payment_type,
                 p.amount
             FROM orders o
             JOIN customers c ON o.customer_id = c.customer_id
             JOIN users u     ON c.user_id = u.user_id
             LEFT JOIN cart_items ci    ON o.cart_id = ci.cart_id
             LEFT JOIN product_items pi ON ci.product_id = pi.product_id
             LEFT JOIN menus m          ON pi.menu_id = m.menu_id
             LEFT JOIN restaurants r    ON m.restaurant_id = r.restaurant_id
             LEFT JOIN payments p       ON o.order_id = p.order_id
             ORDER BY o.created_at DESC
             LIMIT 200"
        );
        return $stmt->fetchAll();
    }
}
?>
