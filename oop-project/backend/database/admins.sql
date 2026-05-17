CREATE Table admins(

admin_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
Foreign Key (user_id) REFERENCES users(user_id) ON DELETE CASCADE

);