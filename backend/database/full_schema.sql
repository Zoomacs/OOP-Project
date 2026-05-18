CREATE DATABASE IF NOT EXISTS oop_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE oop_project;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

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

INSERT INTO users (name,email,university_id,password_hash,role,department,status,restaurant_id) VALUES
('System Admin','admin@qless.local','admin','123','admin','IT','Active',NULL),
('Restaurant Owner','owner@qless.local','owner','123','owner','Restaurants','Active',1),
('Restaurant Staff','staff@qless.local','staff','123','staff','Kitchen','Active',1),
('Leafy Owner','leafy@qless.local','owner2','123','owner','Restaurants','Active',2),
('Zen Owner','zen@qless.local','owner3','123','owner','Restaurants','Active',3),
('Student User','student@qless.local','123','123','student','Computer Science','Active',NULL);

INSERT INTO restaurants (id,owner_user_id,name,owner_name,owner_email,phone,category,description,address,opening_hours,image_url,is_open,rating,reviews,prep_time,staff_delivery) VALUES
(1,2,'The Student Union Grill','Restaurant Owner','owner@qless.local','01000000000','Fast Food','Fast Food • Burgers • Fries','Campus Food Court','9 AM - 9 PM','https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',1,4.8,342,'15-20 min',1),
(2,4,'Leafy & Green','Leafy Owner','leafy@qless.local','01000000001','Healthy','Healthy • Salads • Wraps','Central Hall','8 AM - 8 PM','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',1,4.9,128,'10-15 min',0),
(3,5,'Zen Garden Express','Zen Owner','zen@qless.local','01000000002','Asian','Asian • Sushi • Ramen','Main Building','11 AM - 10 PM','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80',0,4.5,89,'25-30 min',1);

INSERT INTO menu_items (restaurant_id,name,description,category,price,rating,image_url,is_available) VALUES
(1,'Smoked Beef Ribs','Good food is always an experience','MEAT',120,5,'https://images.unsplash.com/photo-1544025162-811114b73330?auto=format&fit=crop&w=300&q=80',1),
(1,'Double Smash Burger','Two patties, secret sauce, caramelized onions','BURGER',95,5,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',1),
(1,'Fresh Mango Smoothie','Large fresh mango smoothie','DRINKS',45,5,'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=300&q=80',1),
(2,'Garden Vegetable Salad','Crisp and refreshing fresh garden salad','VEGAN',65,5,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',1),
(2,'Truffle Avocado Toast','Sourdough bread, avocado, truffle oil','VEGAN',85,5,'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=300&q=80',1),
(3,'Seafood Cuttlefish','For a better menu experience','SEAFOOD',110,5,'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=300&q=80',1),
(3,'Roasted Duck With Honey','Finger licking good roasted duck','SPECIAL',130,4,'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=300&q=80',0);

INSERT INTO orders (user_id,restaurant_id,status,total_amount,payment_method,note) VALUES
(6,1,'pending',165,'cash','No onions'),
(6,1,'preparing',95,'instapay','Extra sauce'),
(6,2,'ready',65,'cash','');

INSERT INTO order_items (order_id,menu_item_id,item_name,quantity,price) VALUES
(1,2,'Double Smash Burger',1,95),(1,3,'Fresh Mango Smoothie',1,45),(2,2,'Double Smash Burger',1,95),(3,4,'Garden Vegetable Salad',1,65);

INSERT INTO payments (order_id,user_id,method,amount,status) VALUES
(1,6,'cash',165,'Success'),(2,6,'instapay',95,'Pending'),(3,6,'cash',65,'Success');

INSERT INTO tickets (user_id,title,email,message,status) VALUES
(6,'Late order complaint','student@qless.local','Customer says order is 30 minutes late.','Urgent'),
(6,'Refund request','student@qless.local','Payment completed but restaurant rejected order.','Pending'),
(2,'Restaurant login issue','owner@qless.local','Owner cannot access dashboard.','Open');

INSERT INTO notifications (user_id,title,description,image_url) VALUES
(6,'Welcome to Q-Less','Your account is connected to the database.',''),
(6,'Order ready','Your meal is ready for pickup!','');



-- =========================================
-- USER FOR QEDRA RESTAURANT
-- =========================================

INSERT INTO users
(
name,
email,
university_id,
password_hash,
role,
department,
status
)
VALUES
(
'Qedra Owner',
'qedra@restaurants.com',
'REST001',
'123456',
'owner',
'Restaurants',
'Active'
);



-- =========================================
-- QEDRA RESTAURANT
-- ID = 1
-- =========================================

INSERT INTO restaurants
(
id,
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
1,
'Qedra',
1,
'Qedra Owner',
'qedra@restaurants.com',
'0100000001',
'Egyptian Food',
'Traditional Egyptian breakfast and oriental food restaurant',
'Alexandria, Egypt',
'24 Hours',
'qedra.jpg',
1,
4.8,
350,
'10-20 min',
1
);
INSERT INTO users
(
name,
email,
university_id,
password_hash,
role,
department,
status
)
VALUES
(
'Mix & Wrap Owner',
'mixwrapowner@restaurants.com',
'REST002',
'123456',
'owner',
'Restaurants',
'Active'
);


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

(11, 'WRAP POTATO', 'Breakfast item', 'BREAK FAST', 55, 5, 'wrap_potato.jpg', 1),
(11, 'CHESSE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 65, 5, 'chesse_wrap_potato.jpg', 1),
(11, 'MIX CHESSE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 70, 5, 'mix_chesse_wrap_potato.jpg', 1),
(11, 'SUPREME WRAP POTATO', 'Breakfast item', 'BREAK FAST', 75, 5, 'supreme_wrap_potato.jpg', 1),
(11, 'VEGO WRAP POTATO', 'Breakfast item', 'BREAK FAST', 80, 5, 'vego_wrap_potato.jpg', 1),
(11, 'TESTE WRAP POTATO', 'Breakfast item', 'BREAK FAST', 85, 5, 'teste_wrap_potato.jpg', 1),
(11, 'MIX CHESSE', 'Breakfast item', 'BREAK FAST', 90, 5, 'mix_chesse.jpg', 1),
(11, 'TUNA', 'Breakfast item', 'BREAK FAST', 95, 5, 'tuna.jpg', 1),
(11, 'SALAMI TURKI', 'Breakfast item', 'BREAK FAST', 100, 5, 'salami_turki.jpg', 1),
(11, 'WRAP FLAFEL', 'Breakfast item', 'BREAK FAST', 105, 5, 'wrap_flafel.jpg', 1),


-- =========================================
-- POTATO & SNACKS
-- =========================================

(11, 'FRENCH FIRES M', 'Medium size', 'POTATO & SNACKS', 50, 5, 'french_fires_m.jpg', 1),
(11, 'FRENCH FIRES L', 'Large size', 'POTATO & SNACKS', 60, 5, 'french_fires_l.jpg', 1),

(11, 'KRINKIL FIRES M', 'Medium size', 'POTATO & SNACKS', 55, 5, 'krinkil_fires_m.jpg', 1),
(11, 'KRINKIL FIRES L', 'Large size', 'POTATO & SNACKS', 65, 5, 'krinkil_fires_l.jpg', 1),

(11, 'CHEESE FIRES M', 'Medium size', 'POTATO & SNACKS', 60, 5, 'cheese_fires_m.jpg', 1),
(11, 'CHEESE FIRES L', 'Large size', 'POTATO & SNACKS', 70, 5, 'cheese_fires_l.jpg', 1),

(11, 'SUPREME FIRES M', 'Medium size', 'POTATO & SNACKS', 70, 5, 'supreme_fires_m.jpg', 1),
(11, 'SUPREME FIRES L', 'Large size', 'POTATO & SNACKS', 80, 5, 'supreme_fires_l.jpg', 1),

(11, 'BOLONEZ FIRES M', 'Medium size', 'POTATO & SNACKS', 70, 5, 'bolonez_fires_m.jpg', 1),
(11, 'BOLONEZ FIRES L', 'Large size', 'POTATO & SNACKS', 80, 5, 'bolonez_fires_l.jpg', 1),

(11, 'JALEBENO FIRES M', 'Medium size', 'POTATO & SNACKS', 60, 5, 'jalebeno_fires_m.jpg', 1),
(11, 'JALEBENO FIRES L', 'Large size', 'POTATO & SNACKS', 70, 5, 'jalebeno_fires_l.jpg', 1),

(11, 'CHICKEN STRIPS M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'chicken_strips_m.jpg', 1),
(11, 'CHICKEN STRIPS L', 'Large size', 'POTATO & SNACKS', 130, 5, 'chicken_strips_l.jpg', 1),

(11, 'CHICKEN PANE M', 'Medium size', 'POTATO & SNACKS', 100, 5, 'chicken_pane_m.jpg', 1),
(11, 'CHICKEN PANE L', 'Large size', 'POTATO & SNACKS', 120, 5, 'chicken_pane_l.jpg', 1),

(11, 'CHICKEN NUGGETS M', 'Medium size', 'POTATO & SNACKS', 100, 5, 'chicken_nuggets_m.jpg', 1),
(11, 'CHICKEN NUGGETS L', 'Large size', 'POTATO & SNACKS', 130, 5, 'chicken_nuggets_l.jpg', 1),

(11, 'SHISH TAWOOQ M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'shish_tawooq_m.jpg', 1),
(11, 'SHISH TAWOOQ L', 'Large size', 'POTATO & SNACKS', 130, 5, 'shish_tawooq_l.jpg', 1),

(11, 'CHICKEN FAJETA M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'chicken_fajeta_m.jpg', 1),
(11, 'CHICKEN FAJETA L', 'Large size', 'POTATO & SNACKS', 130, 5, 'chicken_fajeta_l.jpg', 1),

(11, 'CHICKEN MUSHROOM M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'chicken_mushroom_m.jpg', 1),
(11, 'CHICKEN MUSHROOM L', 'Large size', 'POTATO & SNACKS', 130, 5, 'chicken_mushroom_l.jpg', 1),

(11, 'CHICKEN SHAWERMA M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'chicken_shawerma_m.jpg', 1),
(11, 'CHICKEN SHAWERMA L', 'Large size', 'POTATO & SNACKS', 130, 5, 'chicken_shawerma_l.jpg', 1),

(11, 'ALAGRIC M', 'Medium size', 'POTATO & SNACKS', 110, 5, 'alagric_m.jpg', 1),
(11, 'ALAGRIC L', 'Large size', 'POTATO & SNACKS', 130, 5, 'alagric_l.jpg', 1),


-- =========================================
-- PIZZA
-- =========================================

(11, 'MARGRITA S', 'Small pizza', 'PIZZA', 100, 5, 'margrita_s.jpg', 1),
(11, 'MARGRITA M', 'Medium pizza', 'PIZZA', 130, 5, 'margrita_m.jpg', 1),

(11, 'SALAMI S', 'Small pizza', 'PIZZA', 110, 5, 'salami_s.jpg', 1),
(11, 'SALAMI M', 'Medium pizza', 'PIZZA', 140, 5, 'salami_m.jpg', 1),

(11, 'HOT DOG S', 'Small pizza', 'PIZZA', 110, 5, 'hot_dog_s.jpg', 1),
(11, 'HOT DOG M', 'Medium pizza', 'PIZZA', 140, 5, 'hot_dog_m.jpg', 1),

(11, 'CHICKEN RANCH S', 'Small pizza', 'PIZZA', 130, 5, 'chicken_ranch_s.jpg', 1),
(11, 'CHICKEN RANCH M', 'Medium pizza', 'PIZZA', 160, 5, 'chicken_ranch_m.jpg', 1),

(11, 'CHICKEN BARBEQUE S', 'Small pizza', 'PIZZA', 130, 5, 'chicken_barbeque_s.jpg', 1),
(11, 'CHICKEN BARBEQUE M', 'Medium pizza', 'PIZZA', 160, 5, 'chicken_barbeque_m.jpg', 1),

(11, 'SUPER SUPREME S', 'Small pizza', 'PIZZA', 150, 5, 'super_supreme_s.jpg', 1),
(11, 'SUPER SUPREME M', 'Medium pizza', 'PIZZA', 200, 5, 'super_supreme_m.jpg', 1),

(11, 'CHICKEN STRIPS S', 'Small pizza', 'PIZZA', 140, 5, 'chicken_strips_s.jpg', 1),
(11, 'CHICKEN STRIPS M', 'Medium pizza', 'PIZZA', 170, 5, 'chicken_strips_m.jpg', 1),

(11, 'SAUSAGE S', 'Small pizza', 'PIZZA', 120, 5, 'sausage_s.jpg', 1),
(11, 'SAUSAGE M', 'Medium pizza', 'PIZZA', 140, 5, 'sausage_m.jpg', 1),

(11, 'MIX CHEESE S', 'Small pizza', 'PIZZA', 110, 5, 'mix_cheese_s.jpg', 1),
(11, 'MIX CHEESE M', 'Medium pizza', 'PIZZA', 140, 5, 'mix_cheese_m.jpg', 1),


-- =========================================
-- FATA
-- =========================================

(11, 'CHICKEN SHAWERMA S', 'Small fata', 'FATA', 120, 5, 'chicken_shawerma_fata_s.jpg', 1),
(11, 'CHICKEN SHAWERMA M', 'Medium fata', 'FATA', 140, 5, 'chicken_shawerma_fata_m.jpg', 1),

(11, 'STRIPS S', 'Small fata', 'FATA', 130, 5, 'strips_fata_s.jpg', 1),
(11, 'STRIPS M', 'Medium fata', 'FATA', 150, 5, 'strips_fata_m.jpg', 1),

(11, 'SHISH TAWOOQ S', 'Small fata', 'FATA', 130, 5, 'shish_tawooq_fata_s.jpg', 1),
(11, 'SHISH TAWOOQ M', 'Medium fata', 'FATA', 150, 5, 'shish_tawooq_fata_m.jpg', 1),

(11, 'ALAGRIC S', 'Small fata', 'FATA', 130, 5, 'alagric_fata_s.jpg', 1),
(11, 'ALAGRIC M', 'Medium fata', 'FATA', 150, 5, 'alagric_fata_m.jpg', 1),

(11, 'CHICKEN FAJETA S', 'Small fata', 'FATA', 130, 5, 'chicken_fajeta_fata_s.jpg', 1),
(11, 'CHICKEN FAJETA M', 'Medium fata', 'FATA', 150, 5, 'chicken_fajeta_fata_m.jpg', 1),

(11, 'MIX CHICKEN S', 'Small fata', 'FATA', 130, 5, 'mix_chicken_s.jpg', 1),
(11, 'MIX CHICKEN M', 'Medium fata', 'FATA', 150, 5, 'mix_chicken_m.jpg', 1),

(11, 'MIX GRILL S', 'Small fata', 'FATA', 140, 5, 'mix_grill_s.jpg', 1),
(11, 'MIX GRILL M', 'Medium fata', 'FATA', 170, 5, 'mix_grill_m.jpg', 1),


-- =========================================
-- PASTA
-- =========================================

(11, 'JUST', 'Pasta item', 'PASTA', 60, 5, 'just.jpg', 1),
(11, 'MUSHROOME', 'Pasta item', 'PASTA', 80, 5, 'mushroome.jpg', 1),
(11, 'MIX CHEESE', 'Pasta item', 'PASTA', 80, 5, 'mix_cheese_pasta.jpg', 1),
(11, 'BOLONEZ', 'Pasta item', 'PASTA', 100, 5, 'bolonez.jpg', 1),
(11, 'HOT DOG', 'Pasta item', 'PASTA', 100, 5, 'hot_dog_pasta.jpg', 1),
(11, 'CHICKEN', 'Pasta item', 'PASTA', 110, 5, 'chicken_pasta.jpg', 1),
(11, 'STRIPS', 'Pasta item', 'PASTA', 130, 5, 'strips_pasta.jpg', 1),
(11, 'ALFARIDO', 'Pasta item', 'PASTA', 120, 5, 'alfarido.jpg', 1),
(11, 'MAC & CHEESE', 'Pasta item', 'PASTA', 130, 5, 'mac_cheese.jpg', 1);
