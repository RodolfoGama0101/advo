package dev.rodolfo.advo.agenda.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.agenda.application.port.out.AgendaRepositoryPort;
import dev.rodolfo.advo.agenda.domain.model.Compromisso;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class AgendaPersistenceAdapter implements AgendaRepositoryPort {

    private final CompromissoJpaRepository repository;
    private final CompromissoMapper mapper;

    public AgendaPersistenceAdapter(CompromissoJpaRepository repository, CompromissoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Compromisso salvar(Compromisso compromisso) {
        CompromissoJpaEntity entity = mapper.toEntity(compromisso);
        CompromissoJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Compromisso> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Compromisso> listarPorUsuarioEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByUsuarioIdAndPeriodo(usuarioId, inicio, fim).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
