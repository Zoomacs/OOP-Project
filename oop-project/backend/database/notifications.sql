CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);