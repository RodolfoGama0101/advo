package dev.rodolfo.advo.auth.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.auth.application.port.out.UsuarioRepositoryPort;
import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository repository;
    private final UsuarioMapper mapper;

    public UsuarioPersistenceAdapter(UsuarioJpaRepository repository, UsuarioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Usuario> buscarPorEmail(Email email) {
        return repository.findByEmail(email.getEndereco())
                .map(mapper::toDomain);
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        UsuarioJpaEntity entity = mapper.toEntity(usuario);
        UsuarioJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public boolean existePorEmail(Email email) {
        return repository.existsByEmail(email.getEndereco());
    }
}
