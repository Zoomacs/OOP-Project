<?php
class MenuController extends Controller
{
    public function index()
    {
        $restaurant_id = intval($_GET['restaurant_id'] ?? $_GET['id'] ?? 1);
        $available_only = intval($_GET['available_only'] ?? 0);
        $sql = "SELECT id, restaurant_id, name, name AS title, description AS `desc`, description, category AS tag, price, rating, image_url AS image, image_url AS image_url, is_available AS inStock, is_available FROM menu_items WHERE restaurant_id=?";
        $params = [$restaurant_id];
        if ($available_only === 1) $sql .= " AND is_available=1";
        $sql .= " ORDER BY id";
        $rows = $this->q($sql, $params)->fetchAll();
        $base = $this->baseUrl() . 'uploads/menu/';
        foreach ($rows as &$r) {
            $r['quantity'] = 0;
            $r['inStock'] = (bool)$r['inStock'];
            $r['is_available'] = (int)$r['is_available'];
            if ($r['image'] && !str_starts_with($r['image'], 'http')) {
                $r['image'] = $base . $r['image'];
                $r['image_url'] = $r['image'];
            }
        }
        $this->ok(['menu' => $rows, 'items' => $rows]);
    }

    public function store($data)
    {
        $restaurant_id = intval($data['restaurant_id'] ?? 0);
        if ($restaurant_id <= 0) $this->fail('Restaurant id is required');
        $image = $this->saveBase64Image($data['image_data'] ?? ($data['image_url'] ?? $data['image'] ?? ''), 'menu');
        $this->q("INSERT INTO menu_items (restaurant_id,name,description,category,price,rating,image_url,is_available) VALUES (?,?,?,?,?,?,?,?)", [$restaurant_id, $data['name'] ?? $data['title'] ?? '', $data['description'] ?? '', $data['category'] ?? $data['tag'] ?? '', floatval($data['price'] ?? 0), intval($data['rating'] ?? 5), $image, $this->boolInt($data['is_available'] ?? $data['inStock'] ?? 1)]);
        $this->ok(['id' => $this->pdo->lastInsertId(), 'image_url' => $image], 'Menu item added');
    }

    public function update($data)
    {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) $this->fail('Menu item id is required');
        $old = $this->q("SELECT image_url FROM menu_items WHERE id=?", [$id])->fetch();
        $image_input = $data['image_data'] ?? ($data['image_url'] ?? $data['image'] ?? '');
        $image = $this->saveBase64Image($image_input, 'menu');
        if ($image === '') $image = $old['image_url'] ?? '';
        $this->q("UPDATE menu_items SET name=?, description=?, category=?, price=?, image_url=?, is_available=? WHERE id=?", [$data['name'] ?? $data['title'] ?? '', $data['description'] ?? '', $data['category'] ?? $data['tag'] ?? '', floatval($data['price'] ?? 0), $image, $this->boolInt($data['is_available'] ?? $data['inStock'] ?? 1), $id]);
        $this->ok(['image_url' => $image], 'Menu item updated');
    }

    public function destroy($data)
    {
        $id = intval($_GET['id'] ?? $data['id'] ?? 0);
        $this->q("DELETE FROM menu_items WHERE id=?", [$id]);
        $this->ok([], 'Menu item deleted');
    }
}
