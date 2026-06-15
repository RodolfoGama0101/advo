package dev.rodolfo.advo.financeiro.application.service;

import dev.rodolfo.advo.financeiro.application.dto.PagarTransacaoCommand;
import dev.rodolfo.advo.financeiro.application.dto.RegistrarTransacaoCommand;
import dev.rodolfo.advo.financeiro.application.dto.TransacaoResponse;
import dev.rodolfo.advo.financeiro.application.port.in.ListarTransacoesUseCase;
import dev.rodolfo.advo.financeiro.application.port.in.PagarTransacaoUseCase;
import dev.rodolfo.advo.financeiro.application.port.in.RegistrarTransacaoUseCase;
import dev.rodolfo.advo.financeiro.application.port.out.FinanceiroRepositoryPort;
import dev.rodolfo.advo.financeiro.domain.exception.TransacaoNaoEncontradaException;
import dev.rodolfo.advo.financeiro.domain.model.TransacaoFinanceira;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinanceiroApplicationService implements RegistrarTransacaoUseCase, PagarTransacaoUseCase, ListarTransacoesUseCase {

    private final FinanceiroRepositoryPort financeiroRepository;

    public FinanceiroApplicationService(FinanceiroRepositoryPort financeiroRepository) {
        this.financeiroRepository = financeiroRepository;
    }

    @Override
    @Transactional
    public TransacaoResponse execute(RegistrarTransacaoCommand input) {
        TransacaoFinanceira transacao = TransacaoFinanceira.criarNova(
                input.titulo(),
                input.descricao(),
                input.tipo(),
                input.valor(),
                input.dataVencimento(),
                input.processoId(),
                input.clienteId(),
                input.usuarioId()
        );

        TransacaoFinanceira salva = financeiroRepository.salvar(transacao);
        return mapToResponse(salva);
    }

    @Override
    @Transactional
    public Void execute(PagarTransacaoCommand input) {
        TransacaoFinanceira transacao = financeiroRepository.buscarPorId(input.id())
                .orElseThrow(() -> new TransacaoNaoEncontradaException(input.id()));

        transacao.pagar(input.dataPagamento());
        financeiroRepository.salvar(transacao);
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransacaoResponse> execute(FiltroTransacao input) {
        List<TransacaoFinanceira> transacoes;

        if (input != null && input.processoId() != null) {
            transacoes = financeiroRepository.listarPorProcesso(input.processoId());
        } else if (input != null && input.clienteId() != null) {
            transacoes = financeiroRepository.listarPorCliente(input.clienteId());
        } else {
            transacoes = financeiroRepository.listarTodas();
        }

        // Verifica status antes de retornar (pode atualizar o status se estiver atrasado)
        transacoes.forEach(t -> {
            t.verificarAtraso();
        });

        return transacoes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private TransacaoResponse mapToResponse(TransacaoFinanceira transacao) {
        return new TransacaoResponse(
                transacao.getId(),
                transacao.getTitulo(),
                transacao.getDescricao(),
                transacao.getTipo(),
                transacao.getStatus(),
                transacao.getValor(),
                transacao.getDataVencimento(),
                transacao.getDataPagamento(),
                transacao.getProcessoId(),
                transacao.getClienteId(),
                transacao.getUsuarioId(),
                transacao.getCriadoEm()
        );
    }
}
