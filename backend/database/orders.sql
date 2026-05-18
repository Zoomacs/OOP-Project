CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    cart_id INT NOT NULL,
    delivery_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
    discount DECIMAL(10,2) DEFAULT 0,
    item_quantity INT DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE SET NULL
);
