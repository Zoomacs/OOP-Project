CREATE Table restaurants(

restaurant_id INT AUTO_INCREMENT PRIMARY KEY ,
owner_id INT NOT NULL,
name VARCHAR(150) NOT NULL, 
Picture VARCHAR(300),
phone VARCHAR(50),
description VARCHAR(300),
location VARCHAR(255),
title VARCHAR(100),
rating INT DEFAULT 0,
opening_hours VARCHAR(100),
password VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Foreign Key (owner_id) REFERENCES users(user_id) ON DELETE CASCADE

);