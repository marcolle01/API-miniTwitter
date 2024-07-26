CREATE DATABASE miniTwitter;

INSERT INTO users (id, email, password, created_at) VALUES (1, 'marcolle01@gmail.com', '1234', NOW());

INSERT INTO tweets (user_id, text, created_at) VALUES (1, 'Hello World!', NOW());