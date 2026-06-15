package dev.rodolfo.advo.processo.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CriarProcessoCommand(
        String numeroProcesso,
        @NotBlank(message = "Título é obrigatório") String titulo,
        String tribunal,
        String vara,
        String descricao,
        @NotNull(message = "Cliente é obrigatório") Long clienteId,
        Long areaDireitoId,
        LocalDate dataDistribuicao,
        BigDecimal valorCausa,
        List<ParteContrariaCommand> partesContrarias,
        List<Long> advogadosResponsaveisIds
) {
    public record ParteContrariaCommand(
            @NotBlank(message = "Nome da parte contrária é obrigatório") String nome,
            String cpfCnpj,
            @NotBlank(message = "Tipo de parte é obrigatório") String tipoParte,
            String advogadoContrario,
            String oabAdvogadoContrario
    ) {}
}
