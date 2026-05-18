-- ============================================================
-- Q-Less Food Ordering Platform — Full Database Schema
-- Database name: q-less_food_ordering_platform
-- Admin login after import: ID = admin, password = admin123
-- ============================================================

CREATE DATABASE IF NOT EXISTS `q-less_food_ordering_platform`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `q-less_food_ordering_platform`;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('student','staff','owner','admin') NOT NULL DEFAULT 'student',
    email VARCHAR(100) NOT NULL UNIQUE,
    university_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    status ENUM('active','banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(100),
    customer_type VARCHAR(100),
    students_points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS restaurant_staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menus (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    number_of_items INT DEFAULT 0,
    category VARCHAR(300),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    name VARCHAR(100),
    note TEXT,
    delivery_status ENUM('pending','in_progress','delivered','cancelled') DEFAULT 'pending',
    fees DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shopping_carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total_price DECIMAL(10,2) DEFAULT 0,
    number_of_items INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product_items(product_id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('unread','read') DEFAULT 'unread',
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    user_email VARCHAR(100),
    title VARCHAR(150),
    message TEXT,
    status ENUM('open','pending','urgent','resolved') DEFAULT 'open',
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

INSERT IGNORE INTO users (name, type, email, university_id, password, status)
VALUES ('System Admin', 'admin', 'admin@qless.edu', 'admin', '$2y$12$wFmsWCV2B56tsXeYpZwXCe586oTY6y4pD4mGOZhA7TTZl/zyItBXW', 'active');

INSERT IGNORE INTO admins (user_id)
SELECT user_id FROM users WHERE university_id = 'admin';

INSERT IGNORE INTO restaurants
    (owner_id, name, description, rating, reviews, prep_time, is_open, staff_delivery, image_url)
SELECT
    user_id,
    'The Student Union Grill',
    'Fast Food • Burgers • Fries',
    4.8,
    342,
    '15-20 min',
    1,
    1,
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80'
FROM users WHERE university_id = 'admin';
