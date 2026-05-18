CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    payment_type ENUM('cash','screenshot','instapay','card') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    screenshot VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
