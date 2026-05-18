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
