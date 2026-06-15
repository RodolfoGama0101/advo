package dev.rodolfo.advo.financeiro.application.port.out;

import dev.rodolfo.advo.financeiro.domain.model.TransacaoFinanceira;

import java.util.List;
import java.util.Optional;

public interface FinanceiroRepositoryPort {
    TransacaoFinanceira salvar(TransacaoFinanceira transacao);
    Optional<TransacaoFinanceira> buscarPorId(Long id);
    List<TransacaoFinanceira> listarTodas();
    List<TransacaoFinanceira> listarPorProcesso(Long processoId);
    List<TransacaoFinanceira> listarPorCliente(Long clienteId);
}
