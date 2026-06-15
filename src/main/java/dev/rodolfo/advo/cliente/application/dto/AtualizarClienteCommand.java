package dev.rodolfo.advo.cliente.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarClienteCommand(
        @NotNull(message = "ID é obrigatório") Long id,
        @NotBlank(message = "Nome é obrigatório") String nome,
        String email,
        String telefone,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String uf,
        String cep,
        String observacoes
) {
}
