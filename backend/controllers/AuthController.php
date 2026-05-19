<?php
class AuthController extends Controller
{
    public function LoginAuth($data)
    {
        $identifier = trim($data['identifier'] ?? $data['ID'] ?? '');
        $password = trim($data['password'] ?? '');
        if ($identifier === '' || $password === '') $this->fail('ID and password are required');
        $user = $this->q("SELECT * FROM users WHERE university_id = ? OR email = ? LIMIT 1", [$identifier, $identifier])->fetch();
        if (!$user) $this->fail('Invalid login data', 401);
        $valid = password_verify($password, $user['password_hash']) || $password === $user['password_hash'];
        if (!$valid || $user['status'] !== 'Active') $this->fail('Invalid login data', 401);
        if (($user['role'] === 'owner' || $user['role'] === 'staff') && empty($user['restaurant_id'])) {
            $restaurant = $this->q("SELECT id FROM restaurants WHERE owner_email=? OR owner_user_id=? ORDER BY id LIMIT 1", [$user['email'], $user['id']])->fetch();
            if ($restaurant) {
                $user['restaurant_id'] = $restaurant['id'];
                $this->q("UPDATE users SET restaurant_id=? WHERE id=?", [$restaurant['id'], $user['id']]);
            }
        }
        unset($user['password_hash']);
        $userModel = UserFactory::create($user);
        $this->ok(['user' => $userModel->toArray()], 'Login successful');
    }

    public function RegisterAuth($data)
    {
        $name = trim($data['name'] ?? $data['fullName'] ?? '');
        $email = trim($data['email'] ?? $data['universityEmail'] ?? '');
        $university_id = trim($data['university_id'] ?? $data['universityID'] ?? $data['staffID'] ?? '');
        $role = strtolower(trim($data['role'] ?? 'student'));
        $department = trim($data['department'] ?? '');
        $password = trim($data['password'] ?? '');
        $restaurant_id = intval($data['restaurant_id'] ?? 0) ?: null;
        if ($name === '' || $email === '' || $university_id === '' || $password === '') $this->fail('Please fill all required fields');
        if (!in_array($role, ['student','staff','owner','admin'])) $role = 'student';
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $this->q("INSERT INTO users (name,email,university_id,password_hash,role,department,status,restaurant_id) VALUES (?,?,?,?,?,?, 'Active',?)", [$name,$email,$university_id,$hash,$role,$department,$restaurant_id]);
        $id = $this->pdo->lastInsertId();
        if ($role === 'owner' && $restaurant_id) $this->q("UPDATE restaurants SET owner_user_id=?, owner_email=? WHERE id=?", [$id, $email, $restaurant_id]);
        $this->ok(['id' => $id], 'Account created successfully');
    }

    public function login($data)
    {
        return $this->LoginAuth($data);
    }

    public function register($data)
    {
        return $this->RegisterAuth($data);
    }


}
