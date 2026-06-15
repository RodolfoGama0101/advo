package dev.rodolfo.advo.tarefa.application.dto;

import dev.rodolfo.advo.tarefa.domain.model.StatusTarefa;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusTarefaCommand(
        @NotNull(message = "ID da tarefa é obrigatório") Long id,
        @NotNull(message = "Novo status é obrigatório") StatusTarefa novoStatus
) {
}
