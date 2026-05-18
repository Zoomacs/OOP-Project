<?php
// backend/controllers/OrderController.php
require_once __DIR__ . '/../models/Order.php';

class OrderController {
    
    // Handles the request for Order History
    public function fetchUserOrderHistory() {
        if (!isset($_GET['customer_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing customer_id parameter."]);
            return;
        }

        $customer_id = $_GET['customer_id'];
        $orderModel = new Order();
        $history = $orderModel->getHistoryByCustomerId($customer_id);

        echo json_encode([
            "status" => "success",
            "data" => $history
        ]);
    }

    // Handles the request for Order Tracking
    public function fetchOrderTracking() {
        if (!isset($_GET['order_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing order_id parameter."]);
            return;
        }

        $order_id = $_GET['order_id'];
        $orderModel = new Order();
        $trackingDetails = $orderModel->getOrderDetails($order_id);

        if ($trackingDetails) {
            echo json_encode([
                "status" => "success",
                "data" => $trackingDetails
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Order not found."]);
        }
    }

    // Handles the request to update status
    public function updateOrderStatus() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['order_id']) || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing parameters."]);
            return;
        }

        $orderModel = new Order();
        if ($orderModel->updateStatus($data['order_id'], $data['status'])) {
            echo json_encode(["status" => "success", "message" => "Status updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update"]);
        }
    }
    public function fetchRestaurantOrders() {
        if (!isset($_GET['restaurant_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing restaurant_id parameter."]);
            return;
        }

        $restaurant_id = $_GET['restaurant_id'];
        $orderModel = new Order();
        $orders = $orderModel->getOrdersByRestaurantId($restaurant_id);

        echo json_encode([
            "status" => "success",
            "data" => $orders
        ]);
    }
}
?>