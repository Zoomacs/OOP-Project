<?php
class RestaurantController extends Controller
{
    public function index()
    {
        $owner_id = intval($_GET['owner_user_id'] ?? 0);
        $restaurant_id = intval($_GET['restaurant_id'] ?? 0);
        $sql = "SELECT id, owner_user_id, name, owner_name, owner_email, phone, description, category, address, opening_hours, image_url AS imageUrl, is_open AS isOpen, rating, reviews, prep_time AS time, staff_delivery AS staffDelivery FROM restaurants";
        $params = [];
        if ($restaurant_id > 0) { $sql .= " WHERE id=?"; $params[] = $restaurant_id; }
        else if ($owner_id > 0) { $sql .= " WHERE owner_user_id=?"; $params[] = $owner_id; }
        $sql .= " ORDER BY id";
        $rows = $this->q($sql, $params)->fetchAll();
        foreach ($rows as &$r) { $r['isOpen'] = (bool)$r['isOpen']; $r['staffDelivery'] = (bool)$r['staffDelivery']; }
        $this->ok(['restaurants' => $rows, 'restaurant' => $rows[0] ?? null]);
    }

    public function store($data)
    {
        $image = $this->saveBase64Image($data['image_data'] ?? ($data['image_url'] ?? ''), 'restaurants');
        $this->q("INSERT INTO restaurants (owner_user_id, name, owner_name, owner_email, phone, category, description, address, opening_hours, image_url, is_open, staff_delivery) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
            intval($data['owner_user_id'] ?? 0) ?: null, $data['name'] ?? '', $data['owner_name'] ?? '', $data['owner_email'] ?? '', $data['phone'] ?? '', $data['category'] ?? '', $data['description'] ?? '', $data['address'] ?? '', $data['opening_hours'] ?? '', $image, intval($data['is_open'] ?? 1), intval($data['staff_delivery'] ?? 0)
        ]);
        $id = $this->pdo->lastInsertId();
        if (!empty($data['owner_user_id'])) $this->q("UPDATE users SET restaurant_id=? WHERE id=?", [$id, intval($data['owner_user_id'])]);
        $this->ok(['id' => $id], 'Restaurant added');
    }

    public function update($data)
    {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) $this->fail('Restaurant id is required');
        $image = $this->saveBase64Image($data['image_data'] ?? ($data['image_url'] ?? ''), 'restaurants');
        if ($image === '') $image = $data['imageUrl'] ?? '';
        $this->q("UPDATE restaurants SET owner_user_id=?, name=?, owner_name=?, owner_email=?, description=?, category=?, phone=?, address=?, opening_hours=?, image_url=?, is_open=?, staff_delivery=? WHERE id=?", [
            intval($data['owner_user_id'] ?? 0) ?: null, $data['name'] ?? '', $data['owner_name'] ?? '', $data['owner_email'] ?? '', $data['description'] ?? '', $data['category'] ?? '', $data['phone'] ?? '', $data['address'] ?? '', $data['opening_hours'] ?? '', $image, $this->boolInt($data['is_open'] ?? 1), $this->boolInt($data['staff_delivery'] ?? 0), $id
        ]);
        if (!empty($data['owner_user_id'])) $this->q("UPDATE users SET restaurant_id=? WHERE id=?", [$id, intval($data['owner_user_id'])]);
        $this->ok(['image_url' => $image], 'Restaurant updated');
    }

    public function destroy($data)
    {
        $id = intval($_GET['id'] ?? $data['id'] ?? 0);
        $this->q("DELETE FROM restaurants WHERE id=?", [$id]);
        $this->ok([], 'Restaurant removed');
    }
}
