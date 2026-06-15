package dev.rodolfo.advo.tarefa.application.dto;

import dev.rodolfo.advo.tarefa.domain.model.PrioridadeTarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CriarTarefaCommand(
        @NotBlank(message = "Título da tarefa é obrigatório") String titulo,
        String descricao,
        PrioridadeTarefa prioridade,
        LocalDate dataVencimento,
        @NotNull(message = "Responsável pela tarefa é obrigatório") Long responsavelId,
        Long processoId
) {
}
