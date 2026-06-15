package dev.rodolfo.advo.documento.application.dto;

import java.time.LocalDateTime;

public record DocumentoResponse(
        Long id,
        String nomeOriginal,
        Long tamanhoBytes,
        String tipoMime,
        Long processoId,
        Long usuarioId,
        LocalDateTime criadoEm
) {
}
