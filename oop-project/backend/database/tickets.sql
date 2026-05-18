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
