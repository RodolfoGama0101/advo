CREATE TABLE movimentacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    processo_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_movimentacao DATE NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mov_processo FOREIGN KEY (processo_id) REFERENCES processo(id),
    CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    INDEX idx_mov_processo (processo_id),
    INDEX idx_mov_data (data_movimentacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
