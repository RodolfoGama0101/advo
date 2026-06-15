package dev.rodolfo.advo.agenda.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CriarCompromissoCommand(
        @NotBlank(message = "Título é obrigatório") String titulo,
        String descricao,
        @NotNull(message = "Data e hora de início são obrigatórias") LocalDateTime dataHoraInicio,
        @NotNull(message = "Data e hora de fim são obrigatórias") LocalDateTime dataHoraFim,
        String localCompromisso,
        @NotNull(message = "Usuário responsável é obrigatório") Long usuarioId,
        Long processoId,
        Long clienteId
) {
}
