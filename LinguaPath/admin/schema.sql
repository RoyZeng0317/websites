-- LinguaPath Vocabulary Database Schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS linguapath CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linguapath;

CREATE TABLE IF NOT EXISTS vocabulary (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  word          VARCHAR(100)   NOT NULL,
  part_of_speech ENUM('noun','verb','adjective','adverb','preposition','conjunction','phrase','other') NOT NULL DEFAULT 'noun',
  cefr_level    ENUM('A1','A2','B1','B2','C1','C2') NOT NULL DEFAULT 'A1',
  category      VARCHAR(80)    NOT NULL DEFAULT '',
  example       TEXT,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cefr (cefr_level),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- Sample data
INSERT INTO vocabulary (word, translation, part_of_speech, cefr_level, category, example) VALUES
('apple',      '蘋果',       'noun',      'A1', 'food',    'I eat an apple every morning.'),
('beautiful',  '美麗的',     'adjective', 'A2', 'general', 'The sunset was beautiful.'),
('accomplish', '完成；達成',  'verb',      'B2', 'general', 'She accomplished her goal after years of hard work.'),
('eloquent',   '口才流利的',  'adjective', 'C1', 'general', 'The politician gave an eloquent speech.');
