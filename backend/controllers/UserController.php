<?php
class UserController extends Controller
{
    public function index()
    {
        $rows = $this->q("SELECT u.id, u.name, u.email, u.university_id, u.role, u.restaurant_id, r.name AS restaurant_name,
            CONCAT(UCASE(LEFT(u.role,1)), SUBSTRING(u.role,2)) AS type, u.status, u.department,
            COUNT(o.id) AS orders, CONCAT(COALESCE(SUM(o.total_amount),0), ' EGP') AS spent
            FROM users u LEFT JOIN orders o ON o.user_id = u.id LEFT JOIN restaurants r ON r.id=u.restaurant_id
            GROUP BY u.id ORDER BY u.id DESC")->fetchAll();
        $this->ok(['users' => $rows]);
    }

    public function store($data)
    {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $university_id = trim($data['university_id'] ?? '');
        $password = trim($data['password'] ?? '123');
        $role = strtolower(trim($data['role'] ?? 'student'));
        if ($name === '' || $email === '' || $university_id === '') $this->fail('Name, email, and login ID are required');
        if (!in_array($role, ['student','staff','owner','admin'])) $role = 'student';
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $this->q("INSERT INTO users (name,email,university_id,password_hash,role,department,status,restaurant_id) VALUES (?,?,?,?,?,?,?,?)", [
            $name, $email, $university_id, $hash, $role, $data['department'] ?? '', $data['status'] ?? 'Active', intval($data['restaurant_id'] ?? 0) ?: null
        ]);
        $this->ok(['id' => $this->pdo->lastInsertId()], 'User created');
    }

    public function update($data)
    {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) $this->fail('User id is required');
        $old = $this->q("SELECT * FROM users WHERE id=?", [$id])->fetch();
        if (!$old) $this->fail('User not found', 404);
        $role = strtolower(trim($data['role'] ?? $old['role']));
        if (!in_array($role, ['student','staff','owner','admin'])) $role = $old['role'];
        $this->q("UPDATE users SET name=?, email=?, university_id=?, role=?, department=?, status=?, restaurant_id=? WHERE id=?", [
            trim($data['name'] ?? $old['name']), trim($data['email'] ?? $old['email']), trim($data['university_id'] ?? $old['university_id']), $role, $data['department'] ?? $old['department'], $data['status'] ?? $old['status'], intval($data['restaurant_id'] ?? 0) ?: null, $id
        ]);
        if (!empty($data['password'])) $this->q("UPDATE users SET password_hash=? WHERE id=?", [password_hash($data['password'], PASSWORD_DEFAULT), $id]);
        $this->ok([], 'User updated');
    }

    public function destroy($data)
    {
        $id = intval($_GET['id'] ?? $data['id'] ?? 0);
        if ($id <= 0) $this->fail('User id is required');
        $this->q("DELETE FROM users WHERE id=?", [$id]);
        $this->ok([], 'User deleted');
    }

    public function ban($data)
    {
        $uid = trim($data['university_id'] ?? '');
        $email = trim($data['email'] ?? '');
        if ($uid !== '') $this->q("UPDATE users SET status='Banned' WHERE university_id=?", [$uid]);
        else if ($email !== '') $this->q("UPDATE users SET status='Banned' WHERE email=?", [$email]);
        else $this->fail('Student ID or email is required');
        $this->ok([], 'Student banned');
    }
}
