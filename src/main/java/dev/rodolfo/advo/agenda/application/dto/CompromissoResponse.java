package dev.rodolfo.advo.agenda.application.dto;

import java.time.LocalDateTime;

public record CompromissoResponse(
        Long id,
        String titulo,
        String descricao,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraFim,
        String localCompromisso,
        Long usuarioId,
        Long processoId,
        Long clienteId,
        LocalDateTime criadoEm
) {
}
