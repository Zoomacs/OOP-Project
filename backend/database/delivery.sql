CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    name VARCHAR(100),
    note TEXT,
    delivery_status ENUM('pending','in_progress','delivered','cancelled') DEFAULT 'pending',
    fees DECIMAL(10,2) DEFAULT 0
);
