<?php
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login($data) {
        $id = $data['id'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($id) || empty($password)) {
            return ["success" => false, "message" => "ID and password are required"];
        }

        // Try finding user by university ID or staff ID
        $user = $this->userModel->findByUniversityId($id);

        if (!$user) {
            return ["success" => false, "message" => "User not found"];
        }

        if (!password_verify($password, $user['password'])) {
            return ["success" => false, "message" => "Incorrect password"];
        }

        return [
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "user_id" => $user['user_id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "type" => $user['type'],
                "customer_type" => $user['customer_type'],
            ]
        ];
    }

    public function register($data) {
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $confirm_password = $data['confirm_password'] ?? '';
        $customer_type = $data['customer_type'] ?? 'student';
        $university_id = $data['university_id'] ?? '';
        $department = $data['department'] ?? null;

        // Validate
        if (empty($name) || empty($email) || empty($password) || empty($university_id)) {
            return ["success" => false, "message" => "All fields are required"];
        }

        if ($password !== $confirm_password) {
            return ["success" => false, "message" => "Passwords do not match"];
        }

        // Check if email already exists
        if ($this->userModel->findByEmail($email)) {
            return ["success" => false, "message" => "Email already registered"];
        }

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        // Create user
        $user_id = $this->userModel->createUser($name, $email, $hashed_password, 'customer');

        // Create customer
        $this->userModel->createCustomer($user_id, null, $customer_type, $university_id, $department);

        return [
            "success" => true,
            "message" => "Account created successfully",
            "user_id" => $user_id
        ];
    }
}
?>