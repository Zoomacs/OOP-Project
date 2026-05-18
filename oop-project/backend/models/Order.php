<?php
// backend/models/Order.php
require_once __DIR__ . '/../config/Database.php';

class Order {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // Fetch all orders for a specific customer (For Order History)
    public function getHistoryByCustomerId($customer_id) {
        $query = "SELECT order_id, total_price, status, created_at, item_quantity 
                  FROM orders 
                  WHERE customer_id = ? 
                  ORDER BY created_at DESC";
                  
        $stmt = $this->db->prepare($query);
        $stmt->execute([$customer_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Fetch specific details of one order (For Order Track)
    public function getOrderDetails($order_id) {
        // We join with deliveries and payments to get a complete tracking picture
        $query = "SELECT o.order_id, o.status, o.total_price, o.created_at, o.note,
                         d.delivery_status, d.location,
                         p.payment_status, p.payment_type
                  FROM orders o
                  LEFT JOIN deliveries d ON o.delivery_id = d.delivery_id
                  LEFT JOIN payments p ON o.order_id = p.order_id
                  WHERE o.order_id = ?";
                  
        $stmt = $this->db->prepare($query);
        $stmt->execute([$order_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // Fetch all orders for a specific restaurant
    public function getOrdersByRestaurantId($restaurant_id) {
        $query = "SELECT DISTINCT o.order_id, o.total_price, o.status, o.created_at, o.item_quantity, o.note 
                  FROM orders o
                  JOIN shopping_carts sc ON o.cart_id = sc.cart_id
                  JOIN cart_items ci ON sc.cart_id = ci.cart_id
                  JOIN product_items pi ON ci.product_id = pi.product_id
                  JOIN menus m ON pi.menu_id = m.menu_id
                  WHERE m.restaurant_id = ? 
                  ORDER BY o.created_at DESC";
                  
        $stmt = $this->db->prepare($query);
        $stmt->execute([$restaurant_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>