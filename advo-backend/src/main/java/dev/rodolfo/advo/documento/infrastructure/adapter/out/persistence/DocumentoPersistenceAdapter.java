package dev.rodolfo.advo.documento.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.documento.application.port.out.DocumentoRepositoryPort;
import dev.rodolfo.advo.documento.domain.model.Documento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DocumentoPersistenceAdapter implements DocumentoRepositoryPort {

    private final DocumentoJpaRepository repository;
    private final DocumentoMapper mapper;

    public DocumentoPersistenceAdapter(DocumentoJpaRepository repository, DocumentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Documento salvar(Documento documento) {
        DocumentoJpaEntity entity = mapper.toEntity(documento);
        DocumentoJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Documento> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Documento> listarPorProcesso(Long processoId) {
        return repository.findByProcessoId(processoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
