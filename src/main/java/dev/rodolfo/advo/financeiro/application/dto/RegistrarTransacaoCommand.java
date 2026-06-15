package dev.rodolfo.advo.financeiro.application.dto;

import dev.rodolfo.advo.financeiro.domain.model.TipoTransacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistrarTransacaoCommand(
        @NotBlank(message = "Título é obrigatório") String titulo,
        String descricao,
        @NotNull(message = "Tipo de transação é obrigatório") TipoTransacao tipo,
        @NotNull(message = "Valor é obrigatório") @Positive(message = "O valor deve ser positivo") BigDecimal valor,
        @NotNull(message = "Data de vencimento é obrigatória") LocalDate dataVencimento,
        Long processoId,
        Long clienteId,
        @NotNull(message = "Usuário responsável é obrigatório") Long usuarioId
) {
}
