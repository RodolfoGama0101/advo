package dev.rodolfo.advo.tarefa.application.dto;

import dev.rodolfo.advo.tarefa.domain.model.PrioridadeTarefa;
import dev.rodolfo.advo.tarefa.domain.model.StatusTarefa;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TarefaResponse(
        Long id,
        String titulo,
        String descricao,
        StatusTarefa status,
        PrioridadeTarefa prioridade,
        LocalDate dataVencimento,
        Long responsavelId,
        Long processoId,
        LocalDateTime criadoEm
) {
}
