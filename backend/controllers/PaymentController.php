<?php
class PaymentController extends Controller
{
    public function IndexPayment()
    {
        $rows = $this->q("SELECT p.id AS raw_id, CONCAT('#TRX-', p.id) AS id, p.order_id, p.user_id, DATE_FORMAT(p.created_at,'%Y-%m-%d') AS date, COALESCE(u.name,'Guest') AS user, r.name AS restaurant, p.method, p.amount AS amount_value, CONCAT(p.amount,' EGP') AS amount, p.status FROM payments p LEFT JOIN users u ON u.id=p.user_id LEFT JOIN orders o ON o.id=p.order_id LEFT JOIN restaurants r ON r.id=o.restaurant_id ORDER BY p.id DESC")->fetchAll();
        $this->ok(['transactions' => $rows, 'payments' => $rows]);
    }

    public function StorePayment($data)
    {
        $this->q("INSERT INTO payments (order_id,user_id,method,amount,status) VALUES (?,?,?,?,?)", [intval($data['order_id'] ?? 0), intval($data['user_id'] ?? 0) ?: null, $data['method'] ?? 'cash', floatval($data['amount'] ?? 0), $data['status'] ?? 'Success']);
        $this->ok(['id' => $this->pdo->lastInsertId()], 'Payment created');
    }

    public function UpdatePayment($data)
    {
        $id = intval($data['id'] ?? $data['raw_id'] ?? 0);
        if ($id <= 0) $this->fail('Payment id is required');
        $this->q("UPDATE payments SET order_id=?, user_id=?, method=?, amount=?, status=? WHERE id=?", [intval($data['order_id'] ?? 0), intval($data['user_id'] ?? 0) ?: null, $data['method'] ?? 'cash', floatval($data['amount'] ?? 0), $data['status'] ?? 'Success', $id]);
        $this->ok([], 'Payment updated');
    }

    public function DestroyPayment($data)
    {
        $id = intval($_GET['id'] ?? $data['id'] ?? 0);
        if ($id <= 0) $this->fail('Payment id is required');
        $this->q("DELETE FROM payments WHERE id=?", [$id]);
        $this->ok([], 'Payment deleted');
    }

    // Backward-compatible route method names
    public function index()
    {
        return $this->IndexPayment();
    }

    public function store($data)
    {
        return $this->StorePayment($data);
    }

    public function update($data)
    {
        return $this->UpdatePayment($data);
    }

    public function destroy($data)
    {
        return $this->DestroyPayment($data);
    }


}
