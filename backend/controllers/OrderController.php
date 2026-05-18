<?php
require_once __DIR__ . '/DesignPatterns.php';
class OrderController extends Controller
{
    use UsesDesignPatterns;
    public function IndexOrder()
    {
        $user_id = intval($_GET['user_id'] ?? 0);
        $restaurant_id = intval($_GET['restaurant_id'] ?? 0);
        $sql = "SELECT o.id, o.restaurant_id, o.note, CONCAT('#ORD-', o.id) AS orderCode, r.name AS restaurant, COALESCE(u.name,'Guest') AS customer, CONCAT(o.total_amount,' EGP') AS total, o.total_amount AS totalPrice, o.status, o.status AS state, o.payment_method AS paymentType, o.created_at AS time FROM orders o LEFT JOIN restaurants r ON r.id=o.restaurant_id LEFT JOIN users u ON u.id=o.user_id";
        $params = [];
        $where = [];
        if ($user_id > 0) { $where[] = "o.user_id=?"; $params[] = $user_id; }
        if ($restaurant_id > 0) { $where[] = "o.restaurant_id=?"; $params[] = $restaurant_id; }
        if ($where) $sql .= " WHERE " . implode(' AND ', $where);
        $sql .= " ORDER BY o.id DESC";
        $this->ok(['orders' => $this->q($sql, $params)->fetchAll()]);
    }

    public function StoreOrder($data)
    {
        $this->pdo->beginTransaction();
        $user_id = intval($data['user_id'] ?? 1);
        $restaurant_id = intval($data['restaurant_id'] ?? 1);
        $payment_method = $data['payment_method'] ?? 'cash';
        $items = $data['items'] ?? [];
        $total = 0;
        foreach ($items as $item) {
            $menu_item_id = intval($item['id'] ?? $item['menu_item_id'] ?? 0);
            if ($menu_item_id > 0) {
                $available = $this->q("SELECT is_available FROM menu_items WHERE id=?", [$menu_item_id])->fetch();
                if (!$available || intval($available['is_available']) !== 1) $this->fail('One or more selected items are out of stock');
            }
            $total += floatval($item['price'] ?? 0) * intval($item['quantity'] ?? 1);
        }
        if ($total <= 0) $total = floatval($data['total_amount'] ?? 0);
        $this->q("INSERT INTO orders (user_id, restaurant_id, status, total_amount, payment_method, note) VALUES (?,?, 'pending', ?, ?, ?)", [$user_id,$restaurant_id,$total,$payment_method,$data['note'] ?? '']);
        $order_id = $this->pdo->lastInsertId();
        foreach ($items as $item) {
            $this->q("INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price) VALUES (?,?,?,?,?)", [$order_id, intval($item['id'] ?? $item['menu_item_id'] ?? 0), $item['title'] ?? $item['name'] ?? 'Item', intval($item['quantity'] ?? 1), floatval($item['price'] ?? 0)]);
        }
        $this->StorePaymentByStrategy($payment_method, $order_id, $user_id, $total, 'Success');
        $this->NotifyObservers('order.created', ['user_id' => $user_id, 'order_id' => $order_id]);
        $this->NotifyObservers('payment.created', ['user_id' => $user_id, 'order_id' => $order_id]);
        $this->pdo->commit();
        $this->ok(['order_id' => $order_id], 'Order created');
    }

    public function UpdateOrder($data)
    {
        $id = intval($data['id'] ?? $data['order_id'] ?? 0);
        if ($id <= 0) $this->fail('Order id is required');
        $this->q("UPDATE orders SET restaurant_id=?, status=?, total_amount=?, payment_method=?, note=? WHERE id=?", [intval($data['restaurant_id'] ?? 0), $data['status'] ?? 'pending', floatval($data['total_amount'] ?? $data['totalPrice'] ?? 0), $data['payment_method'] ?? $data['paymentType'] ?? 'cash', $data['note'] ?? '', $id]);
        $this->ok([], 'Order updated');
    }

    public function DestroyOrder($data)
    {
        $id = intval($_GET['id'] ?? $data['id'] ?? 0);
        if ($id <= 0) $this->fail('Order id is required');
        $this->q("DELETE FROM orders WHERE id=?", [$id]);
        $this->ok([], 'Order deleted');
    }

    public function RestaurantOrdersOrder()
    {
        $restaurant_id = intval($_GET['restaurant_id'] ?? 1);
        $rows = $this->q("SELECT o.id, o.status AS state, o.payment_method AS paymentType, o.total_amount AS totalPrice, o.note, COALESCE(u.name,'Guest') AS senderName,
            COALESCE(GROUP_CONCAT(CONCAT(oi.quantity,'x ',oi.item_name) SEPARATOR ', '),'No items') AS itemName, COALESCE(SUM(oi.quantity),1) AS quantity
            FROM orders o LEFT JOIN users u ON u.id=o.user_id LEFT JOIN order_items oi ON oi.order_id=o.id
            WHERE o.restaurant_id=? AND o.status IN ('pending','preparing','ready') GROUP BY o.id ORDER BY o.id DESC", [$restaurant_id])->fetchAll();
        $this->ok(['orders' => $rows]);
    }

    public function UpdateStatusOrder($data)
    {
        $id = intval($data['order_id'] ?? $data['id'] ?? 0);
        $status = $data['status'] ?? 'pending';
        $this->q("UPDATE orders SET status=? WHERE id=?", [$status, $id]);
        $ord = $this->q("SELECT user_id FROM orders WHERE id=?", [$id])->fetch();
        if ($ord) $this->NotifyObservers('order.status_updated', ['user_id' => $ord['user_id'], 'order_id' => $id, 'status' => $status]);
        $this->ok([], 'Order status updated');
    }

    public function TrackOrder()
    {
        $id = intval($_GET['order_id'] ?? 0);
        $row = $this->q("SELECT id, status, created_at FROM orders WHERE id=?", [$id])->fetch();
        if (!$row) $this->fail('Order not found', 404);
        $this->ok(['order' => $row]);
    }

    // Backward-compatible route method names
    public function index()
    {
        return $this->IndexOrder();
    }

    public function store($data)
    {
        return $this->StoreOrder($data);
    }

    public function update($data)
    {
        return $this->UpdateOrder($data);
    }

    public function destroy($data)
    {
        return $this->DestroyOrder($data);
    }

    public function restaurantOrders()
    {
        return $this->RestaurantOrdersOrder();
    }

    public function updateStatus($data)
    {
        return $this->UpdateStatusOrder($data);
    }

    public function track()
    {
        return $this->TrackOrder();
    }


}
