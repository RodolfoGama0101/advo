-- Corrige o hash da senha do usuário administrador para corresponder a "admin123"
UPDATE usuario 
SET senha_hash = '$2a$10$2TT8mGQmPv6AbZl99Io6aOAkhJxqCdvadkVt/FAZNg9TKEDDwA3I6' 
WHERE email = 'admin@advo.dev';
