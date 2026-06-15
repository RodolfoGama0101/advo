package dev.rodolfo.advo.cliente.application.dto;

import dev.rodolfo.advo.cliente.domain.model.StatusCliente;
import dev.rodolfo.advo.cliente.domain.model.TipoPessoa;
import java.time.LocalDateTime;

public record ClienteResponse(
        Long id,
        String nome,
        TipoPessoa tipoPessoa,
        String cpfCnpj,
        String email,
        String telefone,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String uf,
        String cep,
        StatusCliente status,
        String observacoes,
        LocalDateTime criadoEm
) {
}
