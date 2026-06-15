CREATE TABLE area_direito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dados iniciais
INSERT INTO area_direito (nome, descricao) VALUES
    ('Direito Civil', 'Contratos, responsabilidade civil, família, sucessões'),
    ('Direito Trabalhista', 'Relações de trabalho, reclamações trabalhistas'),
    ('Direito Criminal', 'Defesa criminal, crimes diversos'),
    ('Direito Tributário', 'Planejamento tributário, contencioso fiscal'),
    ('Direito Empresarial', 'Societário, contratos empresariais, recuperação judicial'),
    ('Direito do Consumidor', 'Relações de consumo, CDC'),
    ('Direito Imobiliário', 'Compra e venda, locação, usucapião'),
    ('Direito Previdenciário', 'Aposentadorias, benefícios do INSS'),
    ('Direito Administrativo', 'Licitações, contratos públicos'),
    ('Direito Ambiental', 'Licenciamento, responsabilidade ambiental');
