package dev.rodolfo.advo.tarefa.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.tarefa.application.port.out.TarefaRepositoryPort;
import dev.rodolfo.advo.tarefa.domain.model.Tarefa;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TarefaPersistenceAdapter implements TarefaRepositoryPort {

    private final TarefaJpaRepository repository;
    private final TarefaMapper mapper;

    public TarefaPersistenceAdapter(TarefaJpaRepository repository, TarefaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Tarefa salvar(Tarefa tarefa) {
        TarefaJpaEntity entity = mapper.toEntity(tarefa);
        TarefaJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Tarefa> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Tarefa> listarPorResponsavel(Long responsavelId) {
        return repository.findByResponsavelId(responsavelId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Tarefa> listarPorProcesso(Long processoId) {
        return repository.findByProcessoId(processoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
