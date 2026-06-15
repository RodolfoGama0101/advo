package dev.rodolfo.advo.processo.application.dto;

import dev.rodolfo.advo.processo.domain.model.FaseProcessual;
import dev.rodolfo.advo.processo.domain.model.StatusProcesso;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ProcessoResponse(
        Long id,
        String numeroProcesso,
        String titulo,
        String tribunal,
        String vara,
        FaseProcessual faseProcessual,
        StatusProcesso status,
        String descricao,
        Long clienteId,
        Long areaDireitoId,
        LocalDate dataDistribuicao,
        BigDecimal valorCausa,
        List<Long> advogadosResponsaveisIds,
        LocalDateTime criadoEm
) {
}
