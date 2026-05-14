DROP TABLE EXITSTS basic;

CREATE TABLE basic(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    meaning VARCHAR(500) NOT NULL,
    explain VARCHAR(255) NOT NULL,
    exaple_sentence VARCHAR(500) NULL,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMETAMP
);

INSERT INTO basic(word, meaning, explain, exaple_sentence) VALUES
('apple', 'img/apple.jpg', 'This is a friut.', 'I eat an apple every morning.'),
('book', 'img/book.jpg', 'This is more paper are make a thins.', 'This book is very interesting.'),
('water', 'img/water.jpg', 'This is a human need drinks.', 'Please drink some water.');