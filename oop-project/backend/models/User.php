<?php
require_once __DIR__ . '/../config/Database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByUniversityId($university_id) {
        $stmt = $this->db->prepare("
            SELECT u.*, c.customer_type, c.university_id, c.department, c.student_points
            FROM users u
            JOIN customers c ON u.user_id = c.user_id
            WHERE c.university_id = ?
        ");
        $stmt->execute([$university_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByStaffId($staff_id) {
        $stmt = $this->db->prepare("
            SELECT u.*, c.customer_type, c.university_id, c.department
            FROM users u
            JOIN customers c ON u.user_id = c.user_id
            WHERE c.university_id = ? AND c.customer_type = 'staff'
        ");
        $stmt->execute([$staff_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("
            SELECT * FROM users WHERE email = ?
        ");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createUser($name, $email, $password, $type) {
        $stmt = $this->db->prepare("
            INSERT INTO users (name, email, password, type)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$name, $email, $password, $type]);
        return $this->db->lastInsertId();
    }

    public function createCustomer($user_id, $phone, $type, $university_id, $department = null) {
        $stmt = $this->db->prepare("
            INSERT INTO customers (user_id, phone, customer_type, university_id, department)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$user_id, $phone, $type, $university_id, $department]);
        return $this->db->lastInsertId();
    }
}
?>