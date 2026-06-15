package dev.rodolfo.advo.financeiro.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.financeiro.application.port.out.FinanceiroRepositoryPort;
import dev.rodolfo.advo.financeiro.domain.model.TransacaoFinanceira;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class FinanceiroPersistenceAdapter implements FinanceiroRepositoryPort {

    private final TransacaoJpaRepository repository;
    private final TransacaoMapper mapper;

    public FinanceiroPersistenceAdapter(TransacaoJpaRepository repository, TransacaoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public TransacaoFinanceira salvar(TransacaoFinanceira transacao) {
        TransacaoJpaEntity entity = mapper.toEntity(transacao);
        TransacaoJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<TransacaoFinanceira> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<TransacaoFinanceira> listarTodas() {
        return repository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransacaoFinanceira> listarPorProcesso(Long processoId) {
        return repository.findByProcessoId(processoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransacaoFinanceira> listarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
