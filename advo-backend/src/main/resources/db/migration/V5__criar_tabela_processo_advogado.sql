CREATE TABLE processo_advogado (
    processo_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    responsavel_principal BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (processo_id, usuario_id),
    CONSTRAINT fk_pa_processo FOREIGN KEY (processo_id) REFERENCES processo(id),
    CONSTRAINT fk_pa_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
