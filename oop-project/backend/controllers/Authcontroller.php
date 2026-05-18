<?php
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login($data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return ["success" => false, "message" => "Email and password are required"];
        }

        $user = $this->userModel->findByEmail($email);

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
                "type" => $user['type']
            ]
        ];
    }

    public function register($data) {
        $name = $data['fullName'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $type = $data['type'] ?? 'student';

        if (empty($name) || empty($email) || empty($password)) {
            return ["success" => false, "message" => "All fields are required"];
        }

        if ($this->userModel->findByEmail($email)) {
            return ["success" => false, "message" => "Email already registered"];
        }

        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        $user_id = $this->userModel->createUser($name, $email, $hashed_password, $type);

        $this->userModel->createCustomer($user_id, null, $type);

        return [
            "success" => true,
            "message" => "Account created successfully",
            "user_id" => $user_id
        ];
    }
}
?>