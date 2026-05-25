CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

INSERT INTO users(user_id, name) VALUES(
    (624826, '曾少'),
    (147526, '王大明'),
    (286876, '胡二狗'),
    (973145, '劉一一');
)