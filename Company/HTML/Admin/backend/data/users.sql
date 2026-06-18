ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

UPDATE users SET password_hash = '$2b$12$obE3fEd3V2R5kuBKd1h2zunmOCeMj4wFaW8R0c6A/Byov82oEzyIW' WHERE user_id = 1001;
UPDATE users SET password_hash = '$2b$12$WYu0pBIKBIgfLKNvL5j8ae2ubQao9G3.5v6KqtOv0yGAtsvOW/cmq' WHERE user_id = 1002;
UPDATE users SET password_hash = '$2b$12$qMOi20UuUE7XWp6hEs2VGuodH6skag5VNmMT/eoJCUdajrLcbvt8C' WHERE user_id = 1003;
UPDATE users SET password_hash = '$2b$12$VR1l/Gk4oIEri2JEgfKVeOnBA8fwk4fNrbzRtCuj54Qj/Nzkr875C' WHERE user_id = 624826;
UPDATE users SET password_hash = '$2b$12$7HpgzHX8LybXIwiqblvAE.Cayq4PZfM18XjAjveoxiOxdLjHKv9KK' WHERE user_id = 147526;
UPDATE users SET password_hash = '$2b$12$R0wWKV1Tm1IUGyCOG.PLNuE1Owk.Ovla23bGbxbCdcn4yr0uVe8uG' WHERE user_id = 286876;
UPDATE users SET password_hash = '$2b$12$XVQXRFVVMzwMJkuzNL4C7uSDnmYfgq5.5Be25zsfOgVarn0qpoMxy' WHERE user_id = 973145;
