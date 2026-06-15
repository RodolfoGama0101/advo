CREATE TABLE compromisso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    local_compromisso VARCHAR(255),
    usuario_id BIGINT NOT NULL COMMENT 'Advogado responsável',
    processo_id BIGINT,
    cliente_id BIGINT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_compromisso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_compromisso_processo FOREIGN KEY (processo_id) REFERENCES processo(id),
    CONSTRAINT fk_compromisso_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    INDEX idx_compromisso_data (data_hora_inicio),
    INDEX idx_compromisso_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
