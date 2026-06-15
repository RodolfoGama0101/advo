CREATE TABLE tarefa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'A_FAZER' COMMENT 'A_FAZER, EM_ANDAMENTO, CONCLUIDO',
    prioridade VARCHAR(50) NOT NULL DEFAULT 'MEDIA' COMMENT 'BAIXA, MEDIA, ALTA, URGENTE',
    data_vencimento DATE,
    responsavel_id BIGINT NOT NULL,
    processo_id BIGINT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarefa_responsavel FOREIGN KEY (responsavel_id) REFERENCES usuario(id),
    CONSTRAINT fk_tarefa_processo FOREIGN KEY (processo_id) REFERENCES processo(id),
    INDEX idx_tarefa_status (status),
    INDEX idx_tarefa_responsavel (responsavel_id),
    INDEX idx_tarefa_vencimento (data_vencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
