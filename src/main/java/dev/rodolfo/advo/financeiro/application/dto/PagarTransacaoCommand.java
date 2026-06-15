package dev.rodolfo.advo.financeiro.application.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PagarTransacaoCommand(
        @NotNull(message = "ID da transação é obrigatório") Long id,
        LocalDate dataPagamento
) {
}
