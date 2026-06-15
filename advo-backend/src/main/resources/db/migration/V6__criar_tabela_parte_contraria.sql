CREATE TABLE parte_contraria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    processo_id BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18),
    tipo_parte VARCHAR(50) NOT NULL COMMENT 'REU, AUTOR, TERCEIRO etc.',
    advogado_contrario VARCHAR(255),
    oab_advogado_contrario VARCHAR(20),
    CONSTRAINT fk_pc_processo FOREIGN KEY (processo_id) REFERENCES processo(id) ON DELETE CASCADE,
    INDEX idx_pc_processo (processo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
