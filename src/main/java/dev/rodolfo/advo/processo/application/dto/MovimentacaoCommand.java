package dev.rodolfo.advo.processo.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MovimentacaoCommand(
        @NotNull(message = "ID do Processo é obrigatório") Long processoId,
        @NotBlank(message = "Título da movimentação é obrigatório") String titulo,
        String descricao,
        @NotNull(message = "Data da movimentação é obrigatória") LocalDate dataMovimentacao,
        @NotNull(message = "ID do Usuário responsável é obrigatório") Long usuarioId
) {
}
