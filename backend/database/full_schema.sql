CREATE DATABASE IF NOT EXISTS oop_project
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

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
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available, points_multiplier)
VALUES
(13, 'Espresso', 'Rich espresso shot', 'Drinks', 25, 5, '', 1, 1.00),
(13, 'Cappuccino', 'Creamy cappuccino with foam', 'Drinks', 35, 5, '', 1, 1.00),
(13, 'Latte', 'Smooth latte with milk', 'Drinks', 35, 5, '', 1, 1.00),
(13, 'Mocha', 'Chocolate mocha coffee', 'Drinks', 40, 5, '', 1, 1.00),
(13, 'Iced Coffee', 'Chilled brewed coffee with ice', 'Drinks', 30, 5, '', 1, 1.00),
(13, 'Frappe', 'Blended iced coffee drink', 'Drinks', 45, 5, '', 1, 1.00),
(13, 'Green Tea', 'Fresh brewed green tea', 'Drinks', 15, 5, '', 1, 1.00),
(13, 'Orange Juice', 'Fresh squeezed orange juice', 'Drinks', 25, 5, '', 1, 1.00),
(13, 'Mango Smoothie', 'Fresh mango blended smoothie', 'Drinks', 35, 5, '', 1, 1.00),
(13, 'Water', 'Bottled water', 'Drinks', 10, 5, '', 1, 1.00);

INSERT INTO menu_items
(restaurant_id, name, description, category, price, rating, image_url, is_available)
VALUES
-- QEDRA MENU
(4, 'Ful Medames', 'Traditional Egyptian fava beans with olive oil and spices', 'BREAK FAST', 35, 5, 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Falafel Sandwich', 'Crispy Egyptian falafel sandwich with salad and tahini', 'BREAK FAST', 25, 5, 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb5?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Taamia Plate', 'Fresh fried taamia served with bread and vegetables', 'BREAK FAST', 40, 5, 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb5?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Eggs With Pastrami', 'Egyptian eggs with pastrami and oriental spices', 'BREAK FAST', 55, 5, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Cheese Sandwich', 'Fresh cheese sandwich with vegetables', 'BREAK FAST', 30, 5, 'https://images.unsplash.com/photo-1604908177522-04025c8f7cbf?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Potato Sandwich', 'Fried potato sandwich with salad and sauce', 'BREAK FAST', 30, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Oriental Breakfast Meal', 'Full breakfast meal with ful, falafel, eggs, bread, and salad', 'BREAK FAST', 95, 5, 'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Koshary', 'Classic Egyptian koshary with rice, pasta, lentils, chickpeas, and sauce', 'MAIN DISH', 70, 5, 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Hawawshi', 'Egyptian meat stuffed bread served hot', 'MAIN DISH', 85, 5, 'https://images.unsplash.com/photo-1604908177522-04025c8f7cbf?auto=format&fit=crop&w=700&q=80', 1),
(4, 'Molokhia Chicken Meal', 'Molokhia with chicken, rice, and oriental sides', 'MAIN DISH', 120, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80', 1),

-- MIX & WRAP BREAK FAST
(11, 'WRAP POTATO', 'Breakfast potato wrap', 'BREAK FAST', 55, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHESSE WRAP POTATO', 'Cheese potato wrap', 'BREAK FAST', 65, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHESSE WRAP POTATO', 'Mixed cheese potato wrap', 'BREAK FAST', 70, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SUPREME WRAP POTATO', 'Supreme potato wrap', 'BREAK FAST', 75, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'VEGO WRAP POTATO', 'Vegetable potato wrap', 'BREAK FAST', 80, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'TESTE WRAP POTATO', 'Special taste potato wrap', 'BREAK FAST', 85, 5, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHESSE', 'Mixed cheese breakfast item', 'BREAK FAST', 90, 5, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'TUNA', 'Tuna breakfast item', 'BREAK FAST', 95, 5, 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SALAMI TURKI', 'Turkey salami breakfast item', 'BREAK FAST', 100, 5, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 1),
(11, 'WRAP FLAFEL', 'Falafel wrap breakfast item', 'BREAK FAST', 105, 5, 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb5?auto=format&fit=crop&w=700&q=80', 1),

-- MIX & WRAP POTATO AND SNACKS
(11, 'FRENCH FIRES M', 'Medium fries', 'POTATO & SNACKS', 50, 5, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'FRENCH FIRES L', 'Large fries', 'POTATO & SNACKS', 60, 5, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'KRINKIL FIRES M', 'Medium crinkle fries', 'POTATO & SNACKS', 55, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', 1),
(11, 'KRINKIL FIRES L', 'Large crinkle fries', 'POTATO & SNACKS', 65, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHEESE FIRES M', 'Medium cheese fries', 'POTATO & SNACKS', 60, 5, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHEESE FIRES L', 'Large cheese fries', 'POTATO & SNACKS', 70, 5, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SUPREME FIRES M', 'Medium supreme fries', 'POTATO & SNACKS', 70, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SUPREME FIRES L', 'Large supreme fries', 'POTATO & SNACKS', 80, 5, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', 1),
(11, 'BOLONEZ FIRES M', 'Medium bolognese fries', 'POTATO & SNACKS', 70, 5, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'BOLONEZ FIRES L', 'Large bolognese fries', 'POTATO & SNACKS', 80, 5, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=700&q=80', 1),
(11, 'JALEBENO FIRES M', 'Medium jalapeno fries', 'POTATO & SNACKS', 60, 5, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'JALEBENO FIRES L', 'Large jalapeno fries', 'POTATO & SNACKS', 70, 5, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN STRIPS M', 'Medium chicken strips', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN STRIPS L', 'Large chicken strips', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN PANE M', 'Medium chicken pane', 'POTATO & SNACKS', 100, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN PANE L', 'Large chicken pane', 'POTATO & SNACKS', 120, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN NUGGETS M', 'Medium chicken nuggets', 'POTATO & SNACKS', 100, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN NUGGETS L', 'Large chicken nuggets', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SHISH TAWOOQ M', 'Medium shish tawooq', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SHISH TAWOOQ L', 'Large shish tawooq', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN FAJETA M', 'Medium chicken fajita', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN FAJETA L', 'Large chicken fajita', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN MUSHROOM M', 'Medium chicken mushroom', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN MUSHROOM L', 'Large chicken mushroom', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN SHAWERMA M', 'Medium chicken shawerma', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN SHAWERMA L', 'Large chicken shawerma', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=700&q=80', 1),
(11, 'ALAGRIC M', 'Medium grilled chicken', 'POTATO & SNACKS', 110, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'ALAGRIC L', 'Large grilled chicken', 'POTATO & SNACKS', 130, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),

-- MIX & WRAP PIZZA
(11, 'MARGRITA S', 'Small margherita pizza', 'PIZZA', 100, 5, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MARGRITA M', 'Medium margherita pizza', 'PIZZA', 130, 5, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SALAMI S', 'Small salami pizza', 'PIZZA', 110, 5, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SALAMI M', 'Medium salami pizza', 'PIZZA', 140, 5, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 1),
(11, 'HOT DOG S', 'Small hot dog pizza', 'PIZZA', 110, 5, 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=80', 1),
(11, 'HOT DOG M', 'Medium hot dog pizza', 'PIZZA', 140, 5, 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN RANCH S', 'Small chicken ranch pizza', 'PIZZA', 130, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN RANCH M', 'Medium chicken ranch pizza', 'PIZZA', 160, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN BARBEQUE S', 'Small chicken barbeque pizza', 'PIZZA', 130, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN BARBEQUE M', 'Medium chicken barbeque pizza', 'PIZZA', 160, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SUPER SUPREME S', 'Small super supreme pizza', 'PIZZA', 150, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SUPER SUPREME M', 'Medium super supreme pizza', 'PIZZA', 200, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN STRIPS S', 'Small chicken strips pizza', 'PIZZA', 140, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN STRIPS M', 'Medium chicken strips pizza', 'PIZZA', 170, 5, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SAUSAGE S', 'Small sausage pizza', 'PIZZA', 120, 5, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SAUSAGE M', 'Medium sausage pizza', 'PIZZA', 140, 5, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHEESE S', 'Small mix cheese pizza', 'PIZZA', 110, 5, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHEESE M', 'Medium mix cheese pizza', 'PIZZA', 140, 5, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', 1),

-- MIX & WRAP FATA
(11, 'CHICKEN SHAWERMA S', 'Small chicken shawerma fata', 'FATA', 120, 5, 'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN SHAWERMA M', 'Medium chicken shawerma fata', 'FATA', 140, 5, 'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=700&q=80', 1),
(11, 'STRIPS S', 'Small strips fata', 'FATA', 130, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'STRIPS M', 'Medium strips fata', 'FATA', 150, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SHISH TAWOOQ S', 'Small shish tawooq fata', 'FATA', 130, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'SHISH TAWOOQ M', 'Medium shish tawooq fata', 'FATA', 150, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'ALAGRIC S', 'Small grilled chicken fata', 'FATA', 130, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'ALAGRIC M', 'Medium grilled chicken fata', 'FATA', 150, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN FAJETA S', 'Small chicken fajita fata', 'FATA', 130, 5, 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN FAJETA M', 'Medium chicken fajita fata', 'FATA', 150, 5, 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHICKEN S', 'Small mix chicken fata', 'FATA', 130, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHICKEN M', 'Medium mix chicken fata', 'FATA', 150, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX GRILL S', 'Small mix grill fata', 'FATA', 140, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX GRILL M', 'Medium mix grill fata', 'FATA', 170, 5, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80', 1),

-- MIX & WRAP PASTA
(11, 'JUST', 'Classic pasta item', 'PASTA', 60, 5, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MUSHROOME', 'Mushroom pasta item', 'PASTA', 80, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MIX CHEESE', 'Mix cheese pasta item', 'PASTA', 80, 5, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'BOLONEZ', 'Bolognese pasta item', 'PASTA', 100, 5, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=700&q=80', 1),
(11, 'HOT DOG', 'Hot dog pasta item', 'PASTA', 100, 5, 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=80', 1),
(11, 'CHICKEN', 'Chicken pasta item', 'PASTA', 110, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80', 1),
(11, 'STRIPS', 'Chicken strips pasta item', 'PASTA', 130, 5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=700&q=80', 1),
(11, 'ALFARIDO', 'Alfredo pasta item', 'PASTA', 120, 5, 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?auto=format&fit=crop&w=700&q=80', 1),
(11, 'MAC & CHEESE', 'Mac and cheese pasta item', 'PASTA', 130, 5, 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=700&q=80', 1);

INSERT INTO notifications
(user_id, title, description, image_url)
VALUES
(2, 'Welcome to Q-Less', 'Your account is connected to the database.', ''),
(2, 'Explore restaurants', 'Qedra and Mix & Wrap are now available.', ''),
(5, 'Staff discount active', 'University staff receives 10% discount on every order.', ''),
(6, 'Qedra staff account', 'You can manage Qedra restaurant orders.', ''),
(7, 'Mix & Wrap staff account', 'You can manage Mix & Wrap restaurant orders.', '');

INSERT INTO tickets
(user_id, title, email, message, status)
VALUES
(2, 'Test support ticket', 'student@qless.local', 'This is a sample support ticket.', 'Open');

