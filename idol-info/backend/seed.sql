-- 種子資料：偶像資訊
-- 使用方式: psql -U postgres -d idol_info -f seed.sql

INSERT INTO idol_groups (name, name_zh, name_ja, debut_date, agency, label, country, biography) VALUES
('Nogizaka46', '乃木坂46', '乃木坂46', '2012-02-22', '乃木坂46合同会社', 'N46Div.', 'JP', '日本大型女子偶像團體，為坂道系列之首。'),
('TWICE', 'TWICE', NULL, '2015-10-20', 'JYP Entertainment', 'Republic Records', 'KR', '韓國JYP娛樂旗下的九人女子團體。'),
('BLACKPINK', 'BLACKPINK', NULL, '2016-08-08', 'YG Entertainment', 'YG Entertainment', 'KR', '韓國YG娛樂旗下的四人女子團體。');

WITH gid AS (SELECT id, name FROM idol_groups)
INSERT INTO idols (stage_name, stage_name_zh, stage_name_ja, real_name, nickname, birth_date, birthplace, blood_type, height_cm) VALUES

('張凌鶴', NULL, NULL, '牛牛', '1999-12-30', '江蘇省無錫市', '', 190),
('周柯宇', NULL, NULL, '周柯宇', '柯宇', '2000-01-01', '江蘇省無錫市', '', 185),
('王翊恩', NULL, NULL, '王翊恩', '翊恩', '2000-02-02', '江蘇省無錫市', '', 180);
('吳宣儀', '吳宣儀', NULL, '吳宣儀', '宣儀', '1996-01-26', '廣東省汕頭市', 'A', 162),
('孟美岐', '孟美岐', NULL, '孟美岐', '美岐', '1996-10-15', '湖北省宜昌市', 'A', 168),
('楊超越', '楊超越', NULL

-- 乃木坂46
('Ikuho', '一ノ瀬美空', '一ノ瀬美空', '一ノ瀬美空', 'いくほ', '2003-05-13', '東京都', 'A', 158),
('Minami', '山下美月', '山下美月', '山下美月', 'みなみ', '1999-07-26', '東京都', 'A', 160),
('Asuka', '齋藤飛鳥', '齋藤飛鳥', '齋藤飛鳥', 'あすか', '1998-08-10', '東京都', 'A', 158),
('Miona', '堀未央奈', '堀未央奈', '堀未央奈', 'みおな', '1996-10-15', '岐阜県', 'O', 162),
-- TWICE
('Nayeon', '娜璉', NULL, 'Im Na-yeon', 'ナヨン', '1995-09-22', '首爾特別市', 'A', 163),
('Jeongyeon', '定延', NULL, 'Yoo Jeong-yeon', 'ジョンヨン', '1996-11-01', '水原市', 'O', 169),
('Momo', 'Momo', 'モモ', 'Hirai Momo', 'モモ', '1996-11-09', '京都府', 'A', 159),
('Sana', 'Sana', 'サナ', 'Minatozaki Sana', 'サナ', '1996-12-29', '大阪府', 'B', 166),
('Jihyo', '志效', NULL, 'Park Ji-hyo', 'ジヒョ', '1997-02-01', '京畿道', 'B', 160),
('Mina', 'Mina', 'ミナ', 'Myoui Mina', 'ミナ', '1997-03-24', '兵庫県', 'A', 163),
('Dahyun', '多賢', NULL, 'Kim Da-hyun', 'タヒョン', '1998-05-28', '城南市', 'O', 165),
('Chaeyoung', '彩瑛', NULL, 'Son Chae-young', 'チェヨン', '1999-04-23', '首爾特別市', 'A', 159),
('Tzuyu', '子瑜', NULL, 'Chou Tzuyu', 'ツウィ', '1999-06-14', '台南市', 'A', 172),
-- BLACKPINK
('Jisoo', 'Jisoo', NULL, 'Kim Ji-soo', 'ジス', '1995-01-03', '首爾特別市', 'A', 162),
('Jennie', 'Jennie', NULL, 'Kim Jennie', 'ジェニー', '1996-01-16', '首爾特別市', 'A', 163),
('Rosé', 'Rosé', NULL, 'Roseanne Park', 'ロゼ', '1997-02-11', '奧克蘭 (紐西蘭)', 'A', 168),
('Lisa', 'Lisa', NULL, 'Pranpriya Manobal', 'リーサ', '1997-03-27', '曼谷', 'O', 166);

-- 團體成員關聯
WITH
  g AS (SELECT id, name FROM idol_groups),
  i AS (SELECT id, stage_name FROM idols)
INSERT INTO group_members (idol_id, group_id, join_date, graduate_date, status) VALUES
((SELECT id FROM i WHERE stage_name='Ikuho'),    (SELECT id FROM g WHERE name='Nogizaka46'), '2022-02-23', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Minami'),   (SELECT id FROM g WHERE name='Nogizaka46'), '2016-09-04', '2024-05-12', 'graduated'),
((SELECT id FROM i WHERE stage_name='Asuka'),    (SELECT id FROM g WHERE name='Nogizaka46'), '2011-08-21', '2023-05-11', 'graduated'),
((SELECT id FROM i WHERE stage_name='Miona'),    (SELECT id FROM g WHERE name='Nogizaka46'), '2013-03-28', '2020-11-27', 'graduated'),
((SELECT id FROM i WHERE stage_name='Nayeon'),   (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Jeongyeon'),(SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Momo'),     (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Sana'),     (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Jihyo'),    (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Mina'),     (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Dahyun'),   (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Chaeyoung'),(SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Tzuyu'),    (SELECT id FROM g WHERE name='TWICE'), '2015-10-20', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Jisoo'),    (SELECT id FROM g WHERE name='BLACKPINK'), '2016-08-08', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Jennie'),   (SELECT id FROM g WHERE name='BLACKPINK'), '2016-08-08', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Rosé'),     (SELECT id FROM g WHERE name='BLACKPINK'), '2016-08-08', NULL, 'active'),
((SELECT id FROM i WHERE stage_name='Lisa'),     (SELECT id FROM g WHERE name='BLACKPINK'), '2016-08-08', NULL, 'active');

-- 專輯
INSERT INTO albums (group_id, title, title_zh, title_ja, release_date, type, total_tracks) VALUES
((SELECT id FROM idol_groups WHERE name='Nogizaka46'), '透明な色', '透明的顏色', '透明な色', '2024-12-18', 'album', 12),
((SELECT id FROM idol_groups WHERE name='TWICE'), 'Formula of Love: O+T=<3', NULL, NULL, '2021-11-12', 'album', 16),
((SELECT id FROM idol_groups WHERE name='TWICE'), 'READY TO BE', NULL, NULL, '2023-03-10', 'ep', 7),
((SELECT id FROM idol_groups WHERE name='BLACKPINK'), 'THE ALBUM', NULL, NULL, '2020-10-02', 'album', 8),
((SELECT id FROM idol_groups WHERE name='BLACKPINK'), 'BORN PINK', NULL, NULL, '2022-09-16', 'album', 8);
