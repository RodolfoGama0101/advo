package dev.rodolfo.advo.financeiro.application.dto;

import dev.rodolfo.advo.financeiro.domain.model.StatusTransacao;
import dev.rodolfo.advo.financeiro.domain.model.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransacaoResponse(
        Long id,
        String titulo,
        String descricao,
        TipoTransacao tipo,
        StatusTransacao status,
        BigDecimal valor,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        Long processoId,
        Long clienteId,
        Long usuarioId,
        LocalDateTime criadoEm
) {
}
