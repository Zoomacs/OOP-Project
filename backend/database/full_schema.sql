CREATE DATABASE IF NOT EXISTS oop_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oop_project;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  university_id VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','staff','owner','admin') NOT NULL DEFAULT 'student',
  department VARCHAR(120) DEFAULT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  restaurant_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  owner_user_id INT NULL,
  owner_name VARCHAR(120) DEFAULT NULL,
  owner_email VARCHAR(160) DEFAULT NULL,
  phone VARCHAR(60) DEFAULT NULL,
  category VARCHAR(80) DEFAULT NULL,
  description TEXT,
  address TEXT,
  opening_hours VARCHAR(120) DEFAULT NULL,
  image_url TEXT,
  is_open TINYINT(1) DEFAULT 1,
  rating DECIMAL(2,1) DEFAULT 4.8,
  reviews INT DEFAULT 0,
  prep_time VARCHAR(40) DEFAULT '15-20 min',
  staff_delivery TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(80) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating INT DEFAULT 5,
  image_url TEXT,
  is_available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  restaurant_id INT NOT NULL,
  status ENUM('pending','preparing','ready','received','delivered','cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(40) DEFAULT 'cash',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NULL,
  item_name VARCHAR(150) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  user_id INT NULL,
  method VARCHAR(40) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(180) NOT NULL,
  email VARCHAR(160) DEFAULT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- =========================================
-- IMAGE SOURCE NOTE
-- Restaurant/menu image_url fields below use public image URLs found from restaurant web/menu pages.
-- Qedra: Talabat logo + MenuEgypt menu images.
-- Mix & Wrap: Talabat restaurant image/logo. Individual item photos were not publicly exposed in the accessible page,
-- so Mix & Wrap menu items use the restaurant image/logo until real item photos are added.
-- =========================================

-- =========================================
-- MAIN USERS ONLY
-- =========================================

INSERT INTO users
(name, email, university_id, password_hash, role, department, status, restaurant_id)
VALUES
('System Admin', 'admin@qless.local', 'admin', '123', 'admin', 'IT', 'Active', NULL),
('Student User', 'student@qless.local', '123', '123', 'student', 'Computer Science', 'Active', NULL),
('Qedra Owner', 'qedra@restaurants.com', 'REST001', '123456', 'owner', 'Restaurants', 'Active', 4),
('Mix & Wrap Owner', 'mixwrapowner@restaurants.com', 'REST002', '123456', 'owner', 'Restaurants', 'Active', 11);

-- =========================================
-- RESTAURANTS
-- Only restaurants related to the comment sections below
-- =========================================

INSERT INTO restaurants
(id, name, owner_user_id, owner_name, owner_email, phone, category, description, address, opening_hours, image_url, is_open, rating, reviews, prep_time, staff_delivery)
VALUES
(
4,
'Qedra',
(SELECT id FROM users WHERE email = 'qedra@restaurants.com' LIMIT 1),
'Qedra Owner',
'qedra@restaurants.com',
'0100000001',
'Egyptian Food',
'Traditional Egyptian breakfast and oriental food restaurant',
'Alexandria, Egypt',
'24 Hours',
'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180',
1,
4.8,
350,
'10-20 min',
1
),
(
11,
'Mix & Wrap',
(SELECT id FROM users WHERE email = 'mixwrapowner@restaurants.com' LIMIT 1),
'Mix & Wrap Owner',
'mixwrapowner@restaurants.com',
'0100000002',
'Fast Food',
'Wraps, pizza, pasta, snacks, and breakfast items',
'Alexandria, Egypt',
'10 AM - 12 AM',
'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180',
1,
4.7,
220,
'15-25 min',
1
);

-- Make owner accounts linked to their restaurants
UPDATE users
SET restaurant_id = 4
WHERE email = 'qedra@restaurants.com';

UPDATE users
SET restaurant_id = 11
WHERE email = 'mixwrapowner@restaurants.com';


-- =========================================
-- QEDRA MENU ITEMS
-- RESTAURANT ID = 4
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES
(4, 'Ful Medames', 'Traditional Egyptian fava beans with olive oil and spices', 'BREAKFAST', 35, 5, 'https://www.menuegypt.com/restaurants_menus/qedra_menu_1.jpg', 1),
(4, 'Falafel Sandwich', 'Fresh Egyptian falafel sandwich with tahini and salad', 'BREAKFAST', 25, 5, 'https://www.menuegypt.com/restaurants_menus/qedra_menu_1.jpg', 1),
(4, 'Feteer Meshaltet', 'Egyptian layered pastry served hot', 'PASTRY', 90, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1),
(4, 'Koshary', 'Rice, pasta, lentils, chickpeas, crispy onions, and tomato sauce', 'MAIN DISH', 65, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1),
(4, 'Mahshi Mix', 'Stuffed vegetables with Egyptian rice mixture', 'MAIN DISH', 85, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1),
(4, 'Molokhia With Chicken', 'Egyptian molokhia served with chicken and rice', 'MAIN DISH', 120, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1),
(4, 'Hawawshi', 'Spiced minced meat stuffed in Egyptian bread', 'SANDWICH', 75, 5, 'https://www.menuegypt.com/restaurants_menus/qedra_menu_4.jpg', 1),
(4, 'Liver Sandwich', 'Alexandrian style liver sandwich', 'SANDWICH', 60, 5, 'https://www.menuegypt.com/restaurants_menus/qedra_menu_4.jpg', 1),
(4, 'Sobia', 'Cold Egyptian coconut drink', 'DRINKS', 30, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1),
(4, 'Tea With Mint', 'Hot Egyptian tea with fresh mint', 'DRINKS', 20, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/Qedra_Logo637896012906314949.jpg?width=180', 1);

-- =========================================
-- MIX & WRAP MENU ITEMS
-- RESTAURANT ID = 11
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- =========================================
-- BREAK FAST
-- =========================================

(11, 'WRAP POTATO', 'Breakfast item', 'BREAK FAST', 55, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHESSE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 65, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX CHESSE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 70, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SUPREME WRAP POTATO', 'Breakfast item', 'BREAK FAST', 75, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'VEGO WRAP POTATO', 'Breakfast item', 'BREAK FAST', 80, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'TESTE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 85, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX CHESSE', 'Breakfast item', 'BREAK FAST', 90, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'TUNA', 'Breakfast item', 'BREAK FAST', 95, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SALAMI TURKI', 'Breakfast item', 'BREAK FAST', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'WRAP FLAFEL', 'Breakfast item', 'BREAK FAST', 105, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),


-- =========================================
-- POTATO & SNACKS
-- =========================================

(11, 'FRENCH FIRES M', 'Medium size', 'POTATO & SNACKS', 50, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'FRENCH FIRES L', 'Large size', 'POTATO & SNACKS', 60, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'KRINKIL FIRES M', 'Medium size', 'POTATO & SNACKS', 55, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'KRINKIL FIRES L', 'Large size', 'POTATO & SNACKS', 65, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHEESE FIRES M', 'Medium size', 'POTATO & SNACKS', 60, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHEESE FIRES L', 'Large size', 'POTATO & SNACKS', 70, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SUPREME FIRES M', 'Medium size', 'POTATO & SNACKS', 70, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SUPREME FIRES L', 'Large size', 'POTATO & SNACKS', 80, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'BOLONEZ FIRES M', 'Medium size', 'POTATO & SNACKS', 70, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'BOLONEZ FIRES L', 'Large size', 'POTATO & SNACKS', 80, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'JALEBENO FIRES M', 'Medium size', 'POTATO & SNACKS', 60, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'JALEBENO FIRES L', 'Large size', 'POTATO & SNACKS', 70, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN STRIPS M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN STRIPS L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN PANE M', 'Medium size', 'POTATO & SNACKS', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN PANE L', 'Large size', 'POTATO & SNACKS', 120, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN NUGGETS M', 'Medium size', 'POTATO & SNACKS', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN NUGGETS L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SHISH TAWOOQ M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SHISH TAWOOQ L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN FAJETA M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN FAJETA L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN MUSHROOM M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN MUSHROOM L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN SHAWERMA M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN SHAWERMA L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'ALAGRIC M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'ALAGRIC L', 'Large size', 'POTATO & SNACKS', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),


-- =========================================
-- PIZZA
-- =========================================

(11, 'MARGRITA S', 'Small pizza', 'PIZZA', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MARGRITA M', 'Medium pizza', 'PIZZA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SALAMI S', 'Small pizza', 'PIZZA', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SALAMI M', 'Medium pizza', 'PIZZA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'HOT DOG S', 'Small pizza', 'PIZZA', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'HOT DOG M', 'Medium pizza', 'PIZZA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN RANCH S', 'Small pizza', 'PIZZA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN RANCH M', 'Medium pizza', 'PIZZA', 160, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN BARBEQUE S', 'Small pizza', 'PIZZA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN BARBEQUE M', 'Medium pizza', 'PIZZA', 160, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SUPER SUPREME S', 'Small pizza', 'PIZZA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SUPER SUPREME M', 'Medium pizza', 'PIZZA', 200, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN STRIPS S', 'Small pizza', 'PIZZA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN STRIPS M', 'Medium pizza', 'PIZZA', 170, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SAUSAGE S', 'Small pizza', 'PIZZA', 120, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SAUSAGE M', 'Medium pizza', 'PIZZA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'MIX CHEESE S', 'Small pizza', 'PIZZA', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX CHEESE M', 'Medium pizza', 'PIZZA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),


-- =========================================
-- FATA
-- =========================================

(11, 'CHICKEN SHAWERMA S', 'Small fata', 'FATA', 120, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN SHAWERMA M', 'Medium fata', 'FATA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'STRIPS S', 'Small fata', 'FATA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'STRIPS M', 'Medium fata', 'FATA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'SHISH TAWOOQ S', 'Small fata', 'FATA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'SHISH TAWOOQ M', 'Medium fata', 'FATA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'ALAGRIC S', 'Small fata', 'FATA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'ALAGRIC M', 'Medium fata', 'FATA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'CHICKEN FAJETA S', 'Small fata', 'FATA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN FAJETA M', 'Medium fata', 'FATA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'MIX CHICKEN S', 'Small fata', 'FATA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX CHICKEN M', 'Medium fata', 'FATA', 150, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),

(11, 'MIX GRILL S', 'Small fata', 'FATA', 140, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX GRILL M', 'Medium fata', 'FATA', 170, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),


-- =========================================
-- PASTA
-- =========================================

(11, 'JUST', 'Pasta item', 'PASTA', 60, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MUSHROOME', 'Pasta item', 'PASTA', 80, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MIX CHEESE', 'Pasta item', 'PASTA', 80, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'BOLONEZ', 'Pasta item', 'PASTA', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'HOT DOG', 'Pasta item', 'PASTA', 100, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'CHICKEN', 'Pasta item', 'PASTA', 110, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'STRIPS', 'Pasta item', 'PASTA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'ALFARIDO', 'Pasta item', 'PASTA', 120, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1),
(11, 'MAC & CHEESE', 'Pasta item', 'PASTA', 130, 5, 'https://images.deliveryhero.io/image/talabat/restaurants/LOGO__Ahmed_Elmetwaly638867296198075638.jpg?width=180', 1);


-- =========================================
-- QEDRA RESTAURANT (restaurant_id = 1)
-- CATEGORY: Fool
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- Regular Foul
(1, 'Regular Foul Carry Out', 'Regular foul with tahini - carry out pack', 'Fool', 44, 5, 'regular_foul_carry.jpg', 1),
(1, 'Regular Foul Sandwich', 'Regular foul with tahini sandwich', 'Fool', 16, 5, 'regular_foul_sandwich.jpg', 1),

-- Foul Damess
(1, 'Foul Damess Carry Out', 'Foul with tomatoes, peppers, onion, olive ring and tahini - carry out pack', 'Fool', 47, 5, 'foul_damess_carry.jpg', 1),
(1, 'Foul Damess Sandwich', 'Foul with tomatoes, peppers, onion, olive ring and tahini sandwich', 'Fool', 22, 5, 'foul_damess_sandwich.jpg', 1),

-- Foul with Salsa
(1, 'Foul with Salsa Carry Out', 'Foul with red sauce and garlic - carry out pack', 'Fool', 43, 5, 'foul_salsa_carry.jpg', 1),
(1, 'Foul with Salsa Sandwich', 'Foul with red sauce and garlic sandwich', 'Fool', 19, 5, 'foul_salsa_sandwich.jpg', 1),

-- Foul with Olive Oil
(1, 'Foul with Olive Oil Carry Out', 'Baked fava beans with olive oil - carry out pack', 'Fool', 51, 5, 'foul_olive_oil_carry.jpg', 1),
(1, 'Foul with Olive Oil Sandwich', 'Baked fava beans with olive oil sandwich', 'Fool', 21, 5, 'foul_olive_oil_sandwich.jpg', 1),

-- Foul with Butter
(1, 'Foul with Butter Carry Out', 'Beans with local butter - carry out pack', 'Fool', 50, 5, 'foul_butter_carry.jpg', 1),
(1, 'Foul with Butter Sandwich', 'Beans with local butter sandwich', 'Fool', 21, 5, 'foul_butter_sandwich.jpg', 1),

-- Foul with Pastrami
(1, 'Foul with Pastrami Carry Out', 'Beans in sauce with pastrami pieces - carry out pack', 'Fool', 74, 5, 'foul_pastrami_carry.jpg', 1),
(1, 'Foul with Pastrami Sandwich', 'Beans in sauce with pastrami pieces sandwich', 'Fool', 32, 5, 'foul_pastrami_sandwich.jpg', 1),

-- Foul with Sausage
(1, 'Foul with Sausage Carry Out', 'Beans in sauce with sausage pieces - carry out pack', 'Fool', 77, 5, 'foul_sausage_carry.jpg', 1),
(1, 'Foul with Sausage Sandwich', 'Beans in sauce with sausage pieces sandwich', 'Fool', 50, 5, 'foul_sausage_sandwich.jpg', 1),

-- Foul with Garlic
(1, 'Foul with Garlic Carry Out', 'Stuffed fava beans with special garlic mixture - carry out pack', 'Fool', 47, 5, 'foul_garlic_carry.jpg', 1),
(1, 'Foul with Garlic Sandwich', 'Stuffed fava beans with special garlic mixture sandwich', 'Fool', 19, 5, 'foul_garlic_sandwich.jpg', 1),

-- Foul Tabasco
(1, 'Foul Tabasco Carry Out', 'Foul with oil, tahini and chili sauce - carry out pack', 'Fool', 52, 5, 'foul_tabasco_carry.jpg', 1),
(1, 'Foul Tabasco Sandwich', 'Foul with oil, tahini and chili sauce sandwich', 'Fool', 29, 5, 'foul_tabasco_sandwich.jpg', 1),

-- Foul with Eggs
(1, 'Foul with Eggs Carry Out', 'Beans in oil with tahini and boiled eggs - carry out pack', 'Fool', 29, 5, 'foul_eggs_carry.jpg', 1),
(1, 'Foul with Eggs Sandwich', 'Beans in oil with tahini and boiled eggs sandwich', 'Fool', 29, 5, 'foul_eggs_sandwich.jpg', 1),

-- Foul Omelette
(1, 'Foul Omelette Carry Out', 'Fava beans in oil with tahini and grilled omelette - carry out pack', 'Fool', 20, 5, 'foul_omelette_carry.jpg', 1),
(1, 'Foul Omelette Sandwich', 'Fava beans in oil with tahini and grilled omelette sandwich', 'Fool', 29, 5, 'foul_omelette_sandwich.jpg', 1),

-- Foul with Pickled Lemon
(1, 'Foul with Pickled Lemon Carry Out', 'Foul with oil, tahini and lemon juice - carry out pack', 'Fool', 46, 5, 'foul_pickled_lemon_carry.jpg', 1),
(1, 'Foul with Pickled Lemon Sandwich', 'Foul with oil, tahini and lemon juice sandwich', 'Fool', 20, 5, 'foul_pickled_lemon_sandwich.jpg', 1);


-- =========================================
-- QEDRA RESTAURANT (restaurant_id = 1)
-- CATEGORY: Ta3mya
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- Taamia
(1, 'Taamia Carry Out', 'Taamia carry out pack', 'Ta3mya', 37, 5, 'taamia_carry.jpg', 1),
(1, 'Taamia Sandwich', 'Taamia sandwich', 'Ta3mya', 17, 5, 'taamia_sandwich.jpg', 1),

-- Taamia Bites
(1, 'Taamia Bites Carry Out', 'Taamia bites carry out pack', 'Ta3mya', 37, 5, 'taamia_bites_carry.jpg', 1),
(1, 'Taamia Bites Sandwich', 'Taamia bites sandwich', 'Ta3mya', 17, 5, 'taamia_bites_sandwich.jpg', 1),

-- Alexandrian Taamia
(1, 'Alexandrian Taamia Carry Out', 'Alexandrian taamia carry out pack', 'Ta3mya', 43, 5, 'alexandrian_taamia_carry.jpg', 1),
(1, 'Alexandrian Taamia Sandwich', 'Alexandrian taamia sandwich', 'Ta3mya', 20, 5, 'alexandrian_taamia_sandwich.jpg', 1),

-- Taamia with Pastrami
(1, 'Taamia with Pastrami Sandwich', 'Taamia with pastrami sandwich', 'Ta3mya', 37, 5, 'taamia_pastrami_sandwich.jpg', 1),

-- Taamia with Labna
(1, 'Taamia with Labna Sandwich', 'Taamia with labna sandwich', 'Ta3mya', 40, 5, 'taamia_labna_sandwich.jpg', 1),

-- Taamia Kiri
(1, 'Taamia Kiri Sandwich', 'Taamia kiri sandwich', 'Ta3mya', 40, 5, 'taamia_kiri_sandwich.jpg', 1);

-- =========================================
-- QEDRA RESTAURANT (restaurant_id = 1)
-- CATEGORY: Cheese
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- Mix Cheese Mint
(1, 'Mix Cheese Mint Carry Out', 'A mixture of cheese with tomato pieces and mint - carry out pack', 'Cheese', 85, 5, 'mix_cheese_mint_carry.jpg', 1),
(1, 'Mix Cheese Mint Sandwich', 'A mixture of cheese with tomato pieces and mint sandwich', 'Cheese', 51, 5, 'mix_cheese_mint_sandwich.jpg', 1),

-- Qarish Cheese (Tomato + Thyme + Olive Oil)
(1, 'Qarish Cheese Special Carry Out', 'Qarish cheese with tomato pieces, thyme and olive oil - carry out pack', 'Cheese', 85, 5, 'qarish_cheese_special_carry.jpg', 1),
(1, 'Qarish Cheese Special Sandwich', 'Qarish cheese with tomato pieces, thyme and olive oil sandwich', 'Cheese', 51, 5, 'qarish_cheese_special_sandwich.jpg', 1),

-- Qarish Cheese (Green Pepper)
(1, 'Qarish Cheese Green Pepper Carry Out', 'Qarish cheese with green pepper and olive oil - carry out pack', 'Cheese', 43, 5, 'qarish_green_pepper_carry.jpg', 1),
(1, 'Qarish Cheese Green Pepper Sandwich', 'Qarish cheese with green pepper and olive oil sandwich', 'Cheese', 29, 5, 'qarish_green_pepper_sandwich.jpg', 1),

-- Al-Menanaa
(1, 'Al-Menanaa Carry Out', 'Cream cheese with tomatoes and fresh mint - carry out pack', 'Cheese', 57, 5, 'almenanaa_carry.jpg', 1),
(1, 'Al-Menanaa Sandwich', 'Cream cheese with tomatoes and fresh mint sandwich', 'Cheese', 35, 5, 'almenanaa_sandwich.jpg', 1),

-- Zaytona
(1, 'Zaytona Carry Out', 'Cream cheese with tomatoes and olive slices - carry out pack', 'Cheese', 67, 5, 'zaytona_carry.jpg', 1),
(1, 'Zaytona Sandwich', 'Cream cheese with tomatoes and olive slices sandwich', 'Cheese', 37, 5, 'zaytona_sandwich.jpg', 1),

-- Ala Adimo
(1, 'Ala Adimo Carry Out', 'Cream cheese with tomatoes and Qedra special mixture - carry out pack', 'Cheese', 67, 5, 'ala_adimo_carry.jpg', 1),
(1, 'Ala Adimo Sandwich', 'Cream cheese with tomatoes and Qedra special mixture sandwich', 'Cheese', 37, 5, 'ala_adimo_sandwich.jpg', 1),

-- Fried Cheese
(1, 'Fried Cheese Carry Out', 'Fried cheese carry out pack', 'Cheese', 102, 5, 'fried_cheese_carry.jpg', 1),
(1, 'Fried Cheese Sandwich', 'Fried cheese sandwich', 'Cheese', 72, 5, 'fried_cheese_sandwich.jpg', 1);


-- =========================================
-- QEDRA RESTAURANT (restaurant_id = 1)
-- CATEGORY: Fries & BTNGAN
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- =========================================
-- Fries
-- =========================================

(1, 'French Fries Carry Out', 'French fries with mixture of spices - carry out pack', 'Fries', 40, 5, 'french_fries_carry.jpg', 1),

(1, 'French Fries Sandwich', 'French fries sandwich with mixture of spices', 'Fries', 32, 5, 'french_fries_sandwich.jpg', 1),

(1, 'French Fries Fino', 'French fries fino sandwich with mixture of spices', 'Fries', 32, 5, 'french_fries_fino.jpg', 1),

-- =========================================
-- BTNGAN
-- =========================================

(1, 'Mousakaa Carry Out', 'Mousakaa carry out pack', 'BTNGAN', 41, 5, 'mousakaa_carry.jpg', 1),

(1, 'Mousakaa Sandwich', 'Mousakaa sandwich', 'BTNGAN', 27, 5, 'mousakaa_sandwich.jpg', 1),

(1, 'Baba Ghanouj Carry Out', 'Baba ghanouj carry out pack', 'BTNGAN', 40, 5, 'baba_ghanouj_carry.jpg', 1),

(1, 'Baba Ghanouj Sandwich', 'Baba ghanouj sandwich', 'BTNGAN', 27, 5, 'baba_ghanouj_sandwich.jpg', 1),

(1, 'Pickled Eggplant Carry Out', 'Pickled eggplant carry out pack', 'BTNGAN', 24, 5, 'pickled_eggplant_carry.jpg', 1),

(1, 'Pickled Eggplant Sandwich', 'Pickled eggplant sandwich', 'BTNGAN', 23, 5, 'pickled_eggplant_sandwich.jpg', 1);

-- =========================================
-- USER FOR COFFEE SHOP
-- =========================================

INSERT INTO users
(name, email, university_id, password_hash, role, department, status)
VALUES
(
'Coffee Shop Owner',
'coffee_shop_owner@fci.com',
'REST008',
'123456',
'owner',
'Restaurants',
'Active'
);

-- =========================================
-- COFFEE SHOP RESTAURANT
-- =========================================
-- Assuming this owner gets the next user id

INSERT INTO restaurants
(
name,
owner_user_id,
owner_name,
owner_email,
phone,
category,
description,
address,
opening_hours,
image_url,
is_open,
rating,
reviews,
prep_time,
staff_delivery
)
VALUES
(
'Coffee Shop',
LAST_INSERT_ID(),
'Coffee Shop Owner',
'coffee_shop_owner@fci.com',
'01088888888',
'Café & Desserts',
'Coffee shop serving hot drinks, desserts, smoothies and bakery items.',
'FCI Campus',
'8 AM - 1 AM',
'coffee_shop_logo.png',
1,
4.9,
0,
'10-15 min',
0
);

-- =========================================
-- COFFEE SHOP (restaurant_id = 12)
-- CATEGORY: HOT DRINKS
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- Turkish Coffee
(12, 'Turkish Coffee S', 'Small Turkish coffee', 'Hot Drinks', 35, 5, 'turkish_coffee_s.jpg', 1),
(12, 'Turkish Coffee M', 'Medium Turkish coffee', 'Hot Drinks', 45, 5, 'turkish_coffee_m.jpg', 1),

-- Espresso
(12, 'Espresso S', 'Small espresso', 'Hot Drinks', 40, 5, 'espresso_s.jpg', 1),
(12, 'Espresso M', 'Medium espresso', 'Hot Drinks', 55, 5, 'espresso_m.jpg', 1),

-- Hot Cider
(12, 'Hot Cider M', 'Medium hot cider', 'Hot Drinks', 50, 5, 'hot_cider_m.jpg', 1),

-- Nescafe
(12, 'Nescafe L', 'Large nescafe', 'Hot Drinks', 75, 5, 'nescafe_l.jpg', 1),

-- Hot Chocolate
(12, 'Hot Chocolate M', 'Medium hot chocolate', 'Hot Drinks', 75, 5, 'hot_chocolate_m.jpg', 1),

-- Orchid
(12, 'Orchid M', 'Medium orchid drink', 'Hot Drinks', 55, 5, 'orchid_m.jpg', 1),

-- Orange With Ginger
(12, 'Orange With Ginger M', 'Medium orange with ginger', 'Hot Drinks', 70, 5, 'orange_ginger_m.jpg', 1),

-- French Coffee
(12, 'French Coffee M', 'Medium french coffee', 'Hot Drinks', 60, 5, 'french_coffee_m.jpg', 1),

-- Flat White
(12, 'Flat White M', 'Medium flat white coffee', 'Hot Drinks', 80, 5, 'flat_white_m.jpg', 1),

-- American Coffee
(12, 'American Coffee M', 'Medium american coffee', 'Hot Drinks', 60, 5, 'american_coffee_m.jpg', 1),

-- Herbs
(12, 'Herbs M', 'Medium herbs drink', 'Hot Drinks', 25, 5, 'herbs_m.jpg', 1),

-- Latte
(12, 'Latte L', 'Large latte', 'Hot Drinks', 70, 5, 'latte_l.jpg', 1),

-- Macchiato
(12, 'Macchiato S', 'Small macchiato', 'Hot Drinks', 40, 5, 'macchiato_s.jpg', 1),
(12, 'Macchiato M', 'Medium macchiato', 'Hot Drinks', 60, 5, 'macchiato_m.jpg', 1),

-- Cappuccino
(12, 'Cappuccino S', 'Small cappuccino', 'Hot Drinks', 45, 5, 'cappuccino_s.jpg', 1),
(12, 'Cappuccino L', 'Large cappuccino', 'Hot Drinks', 75, 5, 'cappuccino_l.jpg', 1),

-- Organic Cocktail
(12, 'Organic Cocktail M', 'Medium organic cocktail', 'Hot Drinks', 50, 5, 'organic_cocktail_m.jpg', 1),

-- Mocha
(12, 'Mocha M', 'Medium mocha', 'Hot Drinks', 80, 5, 'mocha_m.jpg', 1),

-- Cinnamon With Milk
(12, 'Cinnamon With Milk M', 'Medium cinnamon with milk', 'Hot Drinks', 30, 5, 'cinnamon_milk_m.jpg', 1),

-- Anise
(12, 'Anise M', 'Medium anise drink', 'Hot Drinks', 25, 5, 'anise_m.jpg', 1),

-- Red Tea
(12, 'Red Tea M', 'Medium red tea', 'Hot Drinks', 25, 5, 'red_tea_m.jpg', 1),

-- Green Tea
(12, 'Green Tea M', 'Medium green tea', 'Hot Drinks', 25, 5, 'green_tea_m.jpg', 1),

-- Mint Tea
(12, 'Mint Tea M', 'Medium mint tea', 'Hot Drinks', 25, 5, 'mint_tea_m.jpg', 1),

-- Mint
(12, 'Mint M', 'Medium mint drink', 'Hot Drinks', 25, 5, 'mint_m.jpg', 1),

-- Early Grey
(12, 'Early Grey M', 'Medium early grey tea', 'Hot Drinks', 25, 5, 'early_grey_m.jpg', 1),

-- Espresso Con Panna
(12, 'Espresso Con Panna M', 'Medium espresso con panna', 'Hot Drinks', 55, 5, 'espresso_con_panna_m.jpg', 1),

-- Caramel Macchiato
(12, 'Caramel Macchiato M', 'Medium caramel macchiato', 'Hot Drinks', 75, 5, 'caramel_macchiato_m.jpg', 1),

-- Spanish Latte
(12, 'Spanish Latte M', 'Medium spanish latte', 'Hot Drinks', 85, 5, 'spanish_latte_m.jpg', 1),

-- Tea Latte
(12, 'Tea Latte M', 'Medium tea latte', 'Hot Drinks', 45, 5, 'tea_latte_m.jpg', 1);

-- =========================================
-- COFFEE SHOP (restaurant_id = 12)
-- CATEGORY: COCKTAILS & SMOOTHIES
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

-- =========================================
-- COCKTAILS
-- =========================================

(12, 'Mint Mojito', 'Fresh mint mojito cocktail', 'Cocktails', 90, 5, 'mint_mojito.jpg', 1),

(12, 'Mojito', 'Classic mojito cocktail', 'Cocktails', 90, 5, 'mojito.jpg', 1),

(12, 'Kiwi Honey', 'Kiwi honey cocktail', 'Cocktails', 75, 5, 'kiwi_honey.jpg', 1),

(12, 'Baby Love', 'Baby love cocktail', 'Cocktails', 80, 5, 'baby_love.jpg', 1),

-- =========================================
-- SMOOTHIES
-- =========================================

(12, 'Lemon Mint Smoothie', 'Lemon mint smoothie', 'Smoothies', 70, 5, 'lemon_mint_smoothie.jpg', 1),

(12, 'Mango Smoothie', 'Fresh mango smoothie', 'Smoothies', 70, 5, 'mango_smoothie.jpg', 1),

(12, 'Strawberry Smoothie', 'Fresh strawberry smoothie', 'Smoothies', 70, 5, 'strawberry_smoothie.jpg', 1),

(12, 'Guava Mint Smoothie', 'Fresh guava mint smoothie', 'Smoothies', 70, 5, 'guava_mint_smoothie.jpg', 1),

(12, 'Espresso Caramel', 'Espresso caramel smoothie', 'Smoothies', 70, 5, 'espresso_caramel.jpg', 1),

(12, 'Booba Tea Caramel Latte', 'Booba tea caramel latte', 'Smoothies', 135, 5, 'booba_tea_caramel_latte.jpg', 1),

(12, 'Booba Tea Mixed Berries', 'Booba tea mixed berries', 'Smoothies', 135, 5, 'booba_tea_mixed_berries.jpg', 1),

(12, 'Pineapple Kiwi Smoothie', 'Pineapple kiwi smoothie', 'Smoothies', 75, 5, 'pineapple_kiwi_smoothie.jpg', 1);


-- =========================================
-- COFFEE SHOP (restaurant_id = 12)
-- CATEGORY: FRAPPE
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

(12, 'Chocolate Frappe', 'Chocolate frappe', 'Frappe', 90, 5, 'chocolate_frappe.jpg', 1),

(12, 'Caramel Frappe', 'Caramel frappe', 'Frappe', 90, 5, 'caramel_frappe.jpg', 1),

(12, 'Latte Frappe', 'Latte frappe', 'Frappe', 90, 5, 'latte_frappe.jpg', 1),

(12, 'Mocha Frappe', 'Mocha frappe', 'Frappe', 90, 5, 'mocha_frappe.jpg', 1),

(12, 'Spanish Latte Frappe', 'Spanish latte frappe', 'Frappe', 90, 5, 'spanish_latte_frappe.jpg', 1);



-- =========================================
-- CATEGORY: MILKSHAKE
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

(12, 'Vanilla Milkshake', 'Vanilla milkshake', 'Milkshake', 95, 5, 'vanilla_milkshake.jpg', 1),

(12, 'Chocolate Milkshake', 'Chocolate milkshake', 'Milkshake', 95, 5, 'chocolate_milkshake.jpg', 1),

(12, 'Strawberry Milkshake', 'Strawberry milkshake', 'Milkshake', 95, 5, 'strawberry_milkshake.jpg', 1),

(12, 'Berry Yogurt Milkshake', 'Berry yogurt milkshake', 'Milkshake', 95, 5, 'berry_yogurt_milkshake.jpg', 1),

(12, 'Hazelnut Milkshake', 'Hazelnut milkshake', 'Milkshake', 95, 5, 'hazelnut_milkshake.jpg', 1),

(12, 'Cheese Lotus Milkshake', 'Cheese lotus milkshake', 'Milkshake', 95, 5, 'cheese_lotus_milkshake.jpg', 1),

(12, 'Blueberry Milkshake', 'Blueberry milkshake', 'Milkshake', 95, 5, 'blueberry_milkshake.jpg', 1),

(12, 'Oreo Milkshake', 'Oreo milkshake', 'Milkshake', 95, 5, 'oreo_milkshake.jpg', 1);



-- =========================================
-- CATEGORY: COLD DRINKS
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

(12, 'Water', 'Mineral water bottle', 'Cold Drinks', 12, 5, 'water.jpg', 1),

(12, 'Soft Drinks', 'Soft drinks can', 'Cold Drinks', 30, 5, 'soft_drinks.jpg', 1),

(12, 'Redbull', 'Energy drink', 'Cold Drinks', 65, 5, 'redbull.jpg', 1),

(12, 'Soda', 'Cold soda drink', 'Cold Drinks', 40, 5, 'soda.jpg', 1),

(12, 'Tropicana', 'Tropicana juice', 'Cold Drinks', 95, 5, 'tropicana.jpg', 1);



-- =========================================
-- CATEGORY: SALADS
-- =========================================

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES

(12, 'Ceaser Salad', 'Fresh ceaser salad', 'Salads', 135, 5, 'ceaser_salad.jpg', 1),

(12, 'Taco Salad', 'Taco salad', 'Salads', 185, 5, 'taco_salad.jpg', 1),

(12, 'Greek Salad', 'Greek salad', 'Salads', 80, 5, 'greek_salad.jpg', 1),

(12, 'Chef Salad', 'Chef salad', 'Salads', 185, 5, 'chef_salad.jpg', 1);