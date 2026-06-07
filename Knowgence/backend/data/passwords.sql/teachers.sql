CREATE TABLE teachers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    teachers_name VARCHAR(100),
    account VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
)
INSERT INTO teachers(teacher_name, account, password_hash)
VALUES('郭永明', '', '')