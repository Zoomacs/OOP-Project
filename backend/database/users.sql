CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('student','staff','owner','admin') NOT NULL DEFAULT 'student',
    email VARCHAR(100) NOT NULL UNIQUE,
    university_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    status ENUM('active','banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
