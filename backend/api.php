<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

function input_json() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
function ok($data = [], $message = 'OK') {
    echo json_encode(array_merge(['success' => true, 'message' => $message], $data));
    exit;
}
function fail($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
function q($sql, $params = []) {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}
function base_url() {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/oop-project/backend/api.php')), '/');
    return $scheme . '://' . $host . $dir . '/';
}
function save_base64_image($value, $folder = 'menu') {
    if (!$value || !is_string($value)) return '';
    if (strpos($value, 'data:image/') !== 0) return $value;
    if (!preg_match('/^data:image\/(png|jpeg|jpg|webp|gif);base64,/', $value, $m)) fail('Invalid image type');
    $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
    $data = substr($value, strpos($value, ',') + 1);
    $binary = base64_decode($data, true);
    if ($binary === false) fail('Invalid image data');
    if (strlen($binary) > 3 * 1024 * 1024) fail('Image is too large. Maximum size is 3MB.');
    $dir = __DIR__ . '/uploads/' . $folder;
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $file = uniqid($folder . '_', true) . '.' . $ext;
    file_put_contents($dir . '/' . $file, $binary);
    return base_url() . 'uploads/' . $folder . '/' . $file;
}
function bool_int($value, $default = 1) {
    if ($value === null || $value === '') return $default;
    if ($value === true || $value === 'true' || $value === 1 || $value === '1') return 1;
    return 0;
}

$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$data = input_json();

try {
    if ($route === 'login' && $method === 'POST') {
        $identifier = trim($data['identifier'] ?? $data['ID'] ?? '');
        $password = trim($data['password'] ?? '');
        if ($identifier === '' || $password === '') fail('ID and password are required');
        $stmt = q("SELECT * FROM users WHERE university_id = ? OR email = ? LIMIT 1", [$identifier, $identifier]);
        $user = $stmt->fetch();
        if (!$user) fail('Invalid login data', 401);
        $valid = password_verify($password, $user['password_hash']) || $password === $user['password_hash'];
        if (!$valid || $user['status'] !== 'Active') fail('Invalid login data', 401);
        if (($user['role'] === 'owner' || $user['role'] === 'staff') && empty($user['restaurant_id'])) {
            $restaurant = q("SELECT id FROM restaurants WHERE owner_email=? OR owner_user_id=? ORDER BY id LIMIT 1", [$user['email'], $user['id']])->fetch();
            if ($restaurant) {
                $user['restaurant_id'] = $restaurant['id'];
                q("UPDATE users SET restaurant_id=? WHERE id=?", [$restaurant['id'], $user['id']]);
            }
        }
        unset($user['password_hash']);
        ok(['user' => $user], 'Login successful');
    }

    if ($route === 'register' && $method === 'POST') {
        $name = trim($data['name'] ?? $data['fullName'] ?? '');
        $email = trim($data['email'] ?? $data['universityEmail'] ?? '');
        $university_id = trim($data['university_id'] ?? $data['universityID'] ?? $data['staffID'] ?? '');
        $role = strtolower(trim($data['role'] ?? 'student'));
        $department = trim($data['department'] ?? '');
        $password = trim($data['password'] ?? '');
        $restaurant_id = intval($data['restaurant_id'] ?? 0) ?: null;
        if ($name === '' || $email === '' || $university_id === '' || $password === '') fail('Please fill all required fields');
        if (!in_array($role, ['student','staff','owner','admin'])) $role = 'student';
        $hash = password_hash($password, PASSWORD_DEFAULT);
        q("INSERT INTO users (name,email,university_id,password_hash,role,department,status,restaurant_id) VALUES (?,?,?,?,?,?, 'Active',?)", [$name,$email,$university_id,$hash,$role,$department,$restaurant_id]);
        $id = $GLOBALS['pdo']->lastInsertId();
        if ($role === 'owner' && $restaurant_id) q("UPDATE restaurants SET owner_user_id=?, owner_email=? WHERE id=?", [$id, $email, $restaurant_id]);
        ok(['id' => $id], 'Account created successfully');
    }

    if ($route === 'users') {
        if ($method === 'GET') {
            $rows = q("SELECT u.id, u.name, u.email, u.university_id, u.role, u.restaurant_id, r.name AS restaurant_name,
                CONCAT(UCASE(LEFT(u.role,1)), SUBSTRING(u.role,2)) AS type, u.status,
                COUNT(o.id) AS orders, CONCAT(COALESCE(SUM(o.total_amount),0), ' EGP') AS spent
                FROM users u LEFT JOIN orders o ON o.user_id = u.id LEFT JOIN restaurants r ON r.id=u.restaurant_id
                GROUP BY u.id ORDER BY u.id DESC")->fetchAll();
            ok(['users' => $rows]);
        }
        if ($method === 'PUT') {
            q("UPDATE users SET status=?, restaurant_id=? WHERE id=?", [$data['status'] ?? 'Active', intval($data['restaurant_id'] ?? 0) ?: null, intval($data['id'] ?? 0)]);
            ok([], 'User updated');
        }
    }

    if ($route === 'ban-user' && $method === 'POST') {
        $uid = trim($data['university_id'] ?? '');
        $email = trim($data['email'] ?? '');
        if ($uid !== '') q("UPDATE users SET status='Banned' WHERE university_id=?", [$uid]);
        else if ($email !== '') q("UPDATE users SET status='Banned' WHERE email=?", [$email]);
        else fail('Student ID or email is required');
        ok([], 'Student banned');
    }

    if ($route === 'restaurants') {
        if ($method === 'GET') {
            $owner_id = intval($_GET['owner_user_id'] ?? 0);
            $restaurant_id = intval($_GET['restaurant_id'] ?? 0);
            $sql = "SELECT id, owner_user_id, name, owner_name, owner_email, phone, description, category, address, opening_hours, image_url AS imageUrl, is_open AS isOpen, rating, reviews, prep_time AS time, staff_delivery AS staffDelivery FROM restaurants";
            $params = [];
            if ($restaurant_id > 0) { $sql .= " WHERE id=?"; $params[] = $restaurant_id; }
            else if ($owner_id > 0) { $sql .= " WHERE owner_user_id=?"; $params[] = $owner_id; }
            $sql .= " ORDER BY id";
            $rows = q($sql, $params)->fetchAll();
            foreach ($rows as &$r) { $r['isOpen'] = (bool)$r['isOpen']; $r['staffDelivery'] = (bool)$r['staffDelivery']; }
            ok(['restaurants' => $rows, 'restaurant' => $rows[0] ?? null]);
        }
        if ($method === 'POST') {
            q("INSERT INTO restaurants (owner_user_id, name, owner_name, owner_email, phone, category, description, address, opening_hours, image_url, is_open, staff_delivery) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
                intval($data['owner_user_id'] ?? 0) ?: null, $data['name'] ?? '', $data['owner_name'] ?? '', $data['owner_email'] ?? '', $data['phone'] ?? '', $data['category'] ?? '', $data['description'] ?? '', $data['address'] ?? '', $data['opening_hours'] ?? '', $data['image_url'] ?? '', intval($data['is_open'] ?? 1), intval($data['staff_delivery'] ?? 0)
            ]);
            $id = $pdo->lastInsertId();
            if (!empty($data['owner_user_id'])) q("UPDATE users SET restaurant_id=? WHERE id=?", [$id, intval($data['owner_user_id'])]);
            ok(['id' => $id], 'Restaurant added');
        }
        if ($method === 'PUT') {
            $id = intval($data['id'] ?? 0);
            if ($id <= 0) fail('Restaurant id is required');
            $image = save_base64_image($data['image_data'] ?? ($data['image_url'] ?? ''), 'restaurants');
            if ($image === '') $image = $data['imageUrl'] ?? '';
            q("UPDATE restaurants SET name=?, description=?, category=?, phone=?, address=?, opening_hours=?, image_url=?, is_open=?, staff_delivery=? WHERE id=?", [
                $data['name'] ?? '', $data['description'] ?? '', $data['category'] ?? '', $data['phone'] ?? '', $data['address'] ?? '', $data['opening_hours'] ?? '', $image, bool_int($data['is_open'] ?? 1), bool_int($data['staff_delivery'] ?? 0), $id
            ]);
            ok(['image_url' => $image], 'Restaurant updated');
        }
        if ($method === 'DELETE') {
            $id = intval($_GET['id'] ?? $data['id'] ?? 0);
            q("DELETE FROM restaurants WHERE id=?", [$id]);
            ok([], 'Restaurant removed');
        }
    }

    if ($route === 'menu') {
        if ($method === 'GET') {
            $restaurant_id = intval($_GET['restaurant_id'] ?? $_GET['id'] ?? 1);
            $available_only = intval($_GET['available_only'] ?? 0);
            $sql = "SELECT id, restaurant_id, name, name AS title, description AS `desc`, description, category AS tag, price, rating, image_url AS image, image_url AS image_url, is_available AS inStock, is_available FROM menu_items WHERE restaurant_id=?";
            $params = [$restaurant_id];
            if ($available_only === 1) $sql .= " AND is_available=1";
            $sql .= " ORDER BY id";
            $rows = q($sql, $params)->fetchAll();
            foreach ($rows as &$r) { $r['quantity'] = 0; $r['inStock'] = (bool)$r['inStock']; $r['is_available'] = (int)$r['is_available']; }
            ok(['menu' => $rows, 'items' => $rows]);
        }
        if ($method === 'POST') {
            $restaurant_id = intval($data['restaurant_id'] ?? 0);
            if ($restaurant_id <= 0) fail('Restaurant id is required');
            $image = save_base64_image($data['image_data'] ?? ($data['image_url'] ?? $data['image'] ?? ''), 'menu');
            q("INSERT INTO menu_items (restaurant_id,name,description,category,price,rating,image_url,is_available) VALUES (?,?,?,?,?,?,?,?)", [$restaurant_id, $data['name'] ?? $data['title'] ?? '', $data['description'] ?? '', $data['category'] ?? $data['tag'] ?? '', floatval($data['price'] ?? 0), intval($data['rating'] ?? 5), $image, bool_int($data['is_available'] ?? $data['inStock'] ?? 1)]);
            ok(['id' => $pdo->lastInsertId(), 'image_url' => $image], 'Menu item added');
        }
        if ($method === 'PUT') {
            $id = intval($data['id'] ?? 0);
            if ($id <= 0) fail('Menu item id is required');
            $old = q("SELECT image_url FROM menu_items WHERE id=?", [$id])->fetch();
            $image_input = $data['image_data'] ?? ($data['image_url'] ?? $data['image'] ?? '');
            $image = save_base64_image($image_input, 'menu');
            if ($image === '') $image = $old['image_url'] ?? '';
            q("UPDATE menu_items SET name=?, description=?, category=?, price=?, image_url=?, is_available=? WHERE id=?", [$data['name'] ?? $data['title'] ?? '', $data['description'] ?? '', $data['category'] ?? $data['tag'] ?? '', floatval($data['price'] ?? 0), $image, bool_int($data['is_available'] ?? $data['inStock'] ?? 1), $id]);
            ok(['image_url' => $image], 'Menu item updated');
        }
        if ($method === 'DELETE') {
            $id = intval($_GET['id'] ?? $data['id'] ?? 0);
            q("DELETE FROM menu_items WHERE id=?", [$id]);
            ok([], 'Menu item deleted');
        }
    }

    if ($route === 'orders') {
        if ($method === 'GET') {
            $user_id = intval($_GET['user_id'] ?? 0);
            $restaurant_id = intval($_GET['restaurant_id'] ?? 0);
            $sql = "SELECT o.id, CONCAT('#ORD-', o.id) AS orderCode, r.name AS restaurant, COALESCE(u.name,'Guest') AS customer, CONCAT(o.total_amount,' EGP') AS total, o.total_amount AS totalPrice, o.status, o.status AS state, o.payment_method AS paymentType, o.created_at AS time FROM orders o LEFT JOIN restaurants r ON r.id=o.restaurant_id LEFT JOIN users u ON u.id=o.user_id";
            $params = [];
            $where = [];
            if ($user_id > 0) { $where[] = "o.user_id=?"; $params[] = $user_id; }
            if ($restaurant_id > 0) { $where[] = "o.restaurant_id=?"; $params[] = $restaurant_id; }
            if ($where) $sql .= " WHERE " . implode(' AND ', $where);
            $sql .= " ORDER BY o.id DESC";
            ok(['orders' => q($sql, $params)->fetchAll()]);
        }
        if ($method === 'POST') {
            $pdo->beginTransaction();
            $user_id = intval($data['user_id'] ?? 1);
            $restaurant_id = intval($data['restaurant_id'] ?? 1);
            $payment_method = $data['payment_method'] ?? 'cash';
            $items = $data['items'] ?? [];
            $total = 0;
            foreach ($items as $item) {
                $menu_item_id = intval($item['id'] ?? $item['menu_item_id'] ?? 0);
                if ($menu_item_id > 0) {
                    $available = q("SELECT is_available FROM menu_items WHERE id=?", [$menu_item_id])->fetch();
                    if (!$available || intval($available['is_available']) !== 1) fail('One or more selected items are out of stock');
                }
                $total += floatval($item['price'] ?? 0) * intval($item['quantity'] ?? 1);
            }
            if ($total <= 0) $total = floatval($data['total_amount'] ?? 0);
            q("INSERT INTO orders (user_id, restaurant_id, status, total_amount, payment_method, note) VALUES (?,?, 'pending', ?, ?, ?)", [$user_id,$restaurant_id,$total,$payment_method,$data['note'] ?? '']);
            $order_id = $pdo->lastInsertId();
            foreach ($items as $item) {
                q("INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price) VALUES (?,?,?,?,?)", [$order_id, intval($item['id'] ?? $item['menu_item_id'] ?? 0), $item['title'] ?? $item['name'] ?? 'Item', intval($item['quantity'] ?? 1), floatval($item['price'] ?? 0)]);
            }
            q("INSERT INTO payments (order_id, user_id, method, amount, status) VALUES (?,?,?,?, 'Success')", [$order_id,$user_id,$payment_method,$total]);
            q("INSERT INTO notifications (user_id,title,description,image_url) VALUES (?, 'Order placed', ?, '')", [$user_id, 'Your order #' . $order_id . ' was sent to the restaurant.']);
            $pdo->commit();
            ok(['order_id' => $order_id], 'Order created');
        }
    }

    if ($route === 'restaurant-orders' && $method === 'GET') {
        $restaurant_id = intval($_GET['restaurant_id'] ?? 1);
        $rows = q("SELECT o.id, o.status AS state, o.payment_method AS paymentType, o.total_amount AS totalPrice, o.note, COALESCE(u.name,'Guest') AS senderName,
            COALESCE(GROUP_CONCAT(CONCAT(oi.quantity,'x ',oi.item_name) SEPARATOR ', '),'No items') AS itemName, COALESCE(SUM(oi.quantity),1) AS quantity
            FROM orders o LEFT JOIN users u ON u.id=o.user_id LEFT JOIN order_items oi ON oi.order_id=o.id
            WHERE o.restaurant_id=? AND o.status IN ('pending','preparing','ready') GROUP BY o.id ORDER BY o.id DESC", [$restaurant_id])->fetchAll();
        ok(['orders' => $rows]);
    }

    if ($route === 'update-status' && $method === 'POST') {
        $id = intval($data['order_id'] ?? $data['id'] ?? 0);
        $status = $data['status'] ?? 'pending';
        q("UPDATE orders SET status=? WHERE id=?", [$status, $id]);
        $ord = q("SELECT user_id FROM orders WHERE id=?", [$id])->fetch();
        if ($ord) q("INSERT INTO notifications (user_id,title,description,image_url) VALUES (?, 'Order update', ?, '')", [$ord['user_id'], 'Order #' . $id . ' is now ' . $status]);
        ok([], 'Order status updated');
    }

    if ($route === 'order-track' && $method === 'GET') {
        $id = intval($_GET['order_id'] ?? 0);
        $row = q("SELECT id, status, created_at FROM orders WHERE id=?", [$id])->fetch();
        if (!$row) fail('Order not found', 404);
        ok(['order' => $row]);
    }

    if ($route === 'payments' || $route === 'transactions') {
        $rows = q("SELECT CONCAT('#TRX-', p.id) AS id, DATE_FORMAT(p.created_at,'%Y-%m-%d') AS date, COALESCE(u.name,'Guest') AS user, r.name AS restaurant, p.method, CONCAT(p.amount,' EGP') AS amount, p.status FROM payments p LEFT JOIN users u ON u.id=p.user_id LEFT JOIN orders o ON o.id=p.order_id LEFT JOIN restaurants r ON r.id=o.restaurant_id ORDER BY p.id DESC")->fetchAll();
        ok(['transactions' => $rows, 'payments' => $rows]);
    }

    if ($route === 'tickets') {
        if ($method === 'GET') {
            ok(['tickets' => q("SELECT CONCAT('#TCK-',id) AS id, id AS raw_id, title, email, message AS text, status, reply FROM tickets ORDER BY raw_id DESC")->fetchAll()]);
        }
        if ($method === 'POST') {
            q("INSERT INTO tickets (user_id,title,email,message,status) VALUES (?,?,?,?, 'Open')", [intval($data['user_id'] ?? 1), $data['title'] ?? 'Support Ticket', $data['email'] ?? '', $data['message'] ?? $data['text'] ?? '']);
            ok(['id' => $pdo->lastInsertId()], 'Ticket sent');
        }
        if ($method === 'PUT') {
            q("UPDATE tickets SET reply=?, status='Answered' WHERE id=?", [$data['reply'] ?? '', intval($data['id'] ?? 0)]);
            ok([], 'Ticket replied');
        }
    }

    if ($route === 'notifications') {
        if ($method === 'GET') {
            $user_id = intval($_GET['user_id'] ?? 1);
            $rows = q("SELECT id,title,description,image_url AS image, DATE_FORMAT(created_at, '%H:%i') AS time FROM notifications WHERE user_id=? ORDER BY id DESC", [$user_id])->fetchAll();
            ok(['notifications' => $rows]);
        }
        if ($method === 'DELETE') {
            q("DELETE FROM notifications WHERE user_id=?", [intval($_GET['user_id'] ?? $data['user_id'] ?? 1)]);
            ok([], 'Notifications cleared');
        }
    }

    if ($route === 'dashboard' || $route === 'admin-stats') {
        $users = q("SELECT COUNT(*) c FROM users")->fetch()['c'];
        $orders = q("SELECT COUNT(*) c FROM orders")->fetch()['c'];
        $restaurants = q("SELECT COUNT(*) c FROM restaurants")->fetch()['c'];
        $revenue = q("SELECT COALESCE(SUM(total_amount),0) c FROM orders")->fetch()['c'];
        ok(['stats' => ['users'=>$users, 'orders'=>$orders, 'restaurants'=>$restaurants, 'revenue'=>$revenue]]);
    }

    if ($route === 'owner-stats' && $method === 'GET') {
        $restaurant_id = intval($_GET['restaurant_id'] ?? 1);
        $orders = q("SELECT COUNT(*) c FROM orders WHERE restaurant_id=?", [$restaurant_id])->fetch()['c'];
        $revenue = q("SELECT COALESCE(SUM(total_amount),0) c FROM orders WHERE restaurant_id=?", [$restaurant_id])->fetch()['c'];
        $items = q("SELECT COUNT(*) c FROM menu_items WHERE restaurant_id=? AND is_available=1", [$restaurant_id])->fetch()['c'];
        ok(['stats' => ['orders'=>$orders, 'revenue'=>$revenue, 'items'=>$items]]);
    }

    fail('Route not found', 404);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    fail($e->getMessage(), 500);
}
