package dev.rodolfo.advo.dashboard.application.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long totalClientesAtivos,
        long totalProcessosEmAndamento,
        long tarefasPendentes,
        BigDecimal receitasPendentesMes,
        BigDecimal despesasPendentesMes,
        BigDecimal saldoPrevistoMes
) {
}
