CREATE Table restaurant_staff(
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    Foreign Key (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    Foreign Key (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);