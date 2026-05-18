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
