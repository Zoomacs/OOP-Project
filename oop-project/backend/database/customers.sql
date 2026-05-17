CREATE Table customers(
    customer_id INT AUTO_INCREMENT PRIMARY key,
    user_id INT NOT NULL,
    phone VARCHAR(100),
    customer_type VARCHAR(100),
    students_points INT DEFAULT 0,
    Foreign Key (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);