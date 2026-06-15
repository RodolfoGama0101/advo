package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.processo.application.port.out.MovimentacaoRepositoryPort;
import dev.rodolfo.advo.processo.application.port.out.ProcessoRepositoryPort;
import dev.rodolfo.advo.processo.domain.model.Movimentacao;
import dev.rodolfo.advo.processo.domain.model.Processo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProcessoPersistenceAdapter implements ProcessoRepositoryPort, MovimentacaoRepositoryPort {

    private final ProcessoJpaRepository processoRepository;
    private final MovimentacaoJpaRepository movimentacaoRepository;
    private final ProcessoMapper processoMapper;

    public ProcessoPersistenceAdapter(ProcessoJpaRepository processoRepository, MovimentacaoJpaRepository movimentacaoRepository, ProcessoMapper processoMapper) {
        this.processoRepository = processoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.processoMapper = processoMapper;
    }

    @Override
    public Processo salvar(Processo processo) {
        ProcessoJpaEntity entity = processoMapper.toEntity(processo);
        ProcessoJpaEntity savedEntity = processoRepository.save(entity);
        return processoMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Processo> buscarPorId(Long id) {
        return processoRepository.findById(id).map(processoMapper::toDomain);
    }

    @Override
    public List<Processo> listarTodos() {
        return processoRepository.findAll().stream()
                .map(processoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existePorNumero(String numeroProcesso) {
        return processoRepository.existsByNumeroProcesso(numeroProcesso);
    }

    @Override
    public Movimentacao salvar(Movimentacao movimentacao) {
        // A persistência de movimentação é feita através da entidade de Processo via Cascade na implementação atual
        // Mas se precisar salvar separadamente, poderíamos converter e salvar.
        // Aqui retornamos o mesmo para manter a consistência com a porta.
        return movimentacao;
    }
}
