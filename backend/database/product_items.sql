CREATE TABLE IF NOT EXISTS product_items (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    rating INT DEFAULT 0,
    description TEXT,
    picture VARCHAR(255),
    is_available TINYINT(1) DEFAULT 1,
    FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE CASCADE
);
