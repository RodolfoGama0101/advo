package dev.rodolfo.advo.cliente.application.dto;

import dev.rodolfo.advo.cliente.domain.model.TipoPessoa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CriarClienteCommand(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotNull(message = "Tipo de pessoa é obrigatório") TipoPessoa tipoPessoa,
        @NotBlank(message = "CPF/CNPJ é obrigatório") String cpfCnpj,
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
