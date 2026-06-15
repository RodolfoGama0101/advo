-- Senha padrão: admin123 (BCrypt hash)
INSERT INTO usuario (nome, email, senha_hash, role, ativo) VALUES
    ('Administrador', 'admin@advo.dev', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN', TRUE);
