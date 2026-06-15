package dev.rodolfo.advo.dashboard.application.service;

import dev.rodolfo.advo.cliente.infrastructure.adapter.out.persistence.ClienteJpaRepository;
import dev.rodolfo.advo.dashboard.application.dto.DashboardResponse;
import dev.rodolfo.advo.financeiro.domain.model.StatusTransacao;
import dev.rodolfo.advo.financeiro.domain.model.TipoTransacao;
import dev.rodolfo.advo.financeiro.infrastructure.adapter.out.persistence.TransacaoJpaEntity;
import dev.rodolfo.advo.financeiro.infrastructure.adapter.out.persistence.TransacaoJpaRepository;
import dev.rodolfo.advo.processo.domain.model.StatusProcesso;
import dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence.ProcessoJpaRepository;
import dev.rodolfo.advo.tarefa.domain.model.StatusTarefa;
import dev.rodolfo.advo.tarefa.infrastructure.adapter.out.persistence.TarefaJpaEntity;
import dev.rodolfo.advo.tarefa.infrastructure.adapter.out.persistence.TarefaJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    // Utilizando os repositórios JPA diretamente para facilitar as queries de agregação nesta camada de visualização
    private final ClienteJpaRepository clienteRepository;
    private final ProcessoJpaRepository processoRepository;
    private final TarefaJpaRepository tarefaRepository;
    private final TransacaoJpaRepository transacaoRepository;

    public DashboardService(ClienteJpaRepository clienteRepository, ProcessoJpaRepository processoRepository, TarefaJpaRepository tarefaRepository, TransacaoJpaRepository transacaoRepository) {
        this.clienteRepository = clienteRepository;
        this.processoRepository = processoRepository;
        this.tarefaRepository = tarefaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse obterResumoDashboard(Long usuarioId) {
        
        long totalClientesAtivos = clienteRepository.count();
        
        // Assumindo que queremos ver todos os processos ativos
        long totalProcessosEmAndamento = processoRepository.findAll().stream()
                .filter(p -> p.getStatus() == StatusProcesso.ATIVO)
                .count();

        // Tarefas pendentes para este usuário
        List<TarefaJpaEntity> tarefas = tarefaRepository.findByResponsavelId(usuarioId);
        long tarefasPendentes = tarefas.stream()
                .filter(t -> t.getStatus() != StatusTarefa.CONCLUIDO)
                .count();

        // Financeiro do mês atual
        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate fimMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<TransacaoJpaEntity> transacoes = transacaoRepository.findAll();
        
        BigDecimal receitasPendentes = transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.RECEITA)
                .filter(t -> t.getStatus() == StatusTransacao.PENDENTE || t.getStatus() == StatusTransacao.ATRASADO)
                .filter(t -> !t.getDataVencimento().isBefore(inicioMes) && !t.getDataVencimento().isAfter(fimMes))
                .map(TransacaoJpaEntity::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal despesasPendentes = transacoes.stream()
                .filter(t -> t.getTipo() == TipoTransacao.DESPESA)
                .filter(t -> t.getStatus() == StatusTransacao.PENDENTE || t.getStatus() == StatusTransacao.ATRASADO)
                .filter(t -> !t.getDataVencimento().isBefore(inicioMes) && !t.getDataVencimento().isAfter(fimMes))
                .map(TransacaoJpaEntity::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldoPrevistoMes = receitasPendentes.subtract(despesasPendentes);

        return new DashboardResponse(
                totalClientesAtivos,
                totalProcessosEmAndamento,
                tarefasPendentes,
                receitasPendentes,
                despesasPendentes,
                saldoPrevistoMes
        );
    }
}
