<?php
require_once __DIR__ . '/../models/Order.php';

class OrderController {
    public function fetchUserOrderHistory() {
        $orderModel = new Order();

        if (isset($_GET['restaurant_id']) && intval($_GET['restaurant_id']) > 0) {
            $history = $orderModel->getHistoryByRestaurantId((int)$_GET['restaurant_id']);
            echo json_encode(["status" => "success", "data" => $history]);
            return;
        }

        if (!isset($_GET['customer_id']) || intval($_GET['customer_id']) <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing customer_id or restaurant_id parameter."]);
            return;
        }

        $history = $orderModel->getHistoryByCustomerId((int)$_GET['customer_id']);
        echo json_encode(["status" => "success", "data" => $history]);
    }

    public function fetchOrderTracking() {
        if (!isset($_GET['order_id']) || intval($_GET['order_id']) <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing order_id parameter."]);
            return;
        }

        $trackingDetails = (new Order())->getOrderDetails((int)$_GET['order_id']);
        if ($trackingDetails) echo json_encode(["status" => "success", "data" => $trackingDetails]);
        else {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Order not found."]);
        }
    }

    public function updateOrderStatus() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['order_id']) || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing order_id or status."]);
            return;
        }

        if ((new Order())->updateStatus((int)$data['order_id'], $data['status'])) {
            echo json_encode(["success" => true, "status" => "success", "message" => "Status updated."]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "status" => "error", "message" => "Invalid status or update failed."]);
        }
    }

    public function getAllOrders() {
        echo json_encode((new Order())->getAllWithDetails());
    }
}
?>
