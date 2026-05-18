CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(300),
    location VARCHAR(255),
    phone VARCHAR(50),
    rating DECIMAL(3,1) DEFAULT 0,
    reviews INT DEFAULT 0,
    prep_time VARCHAR(50) DEFAULT '15-20 min',
    is_open TINYINT(1) DEFAULT 1,
    staff_delivery TINYINT(1) DEFAULT 0,
    image_url VARCHAR(300),
    opening_hours VARCHAR(100),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);
