package dev.rodolfo.advo.cliente.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.cliente.application.port.out.ClienteRepositoryPort;
import dev.rodolfo.advo.cliente.domain.model.Cliente;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ClientePersistenceAdapter implements ClienteRepositoryPort {

    private final ClienteJpaRepository repository;
    private final ClienteMapper mapper;

    public ClientePersistenceAdapter(ClienteJpaRepository repository, ClienteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Cliente salvar(Cliente cliente) {
        ClienteJpaEntity entity = mapper.toEntity(cliente);
        ClienteJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Cliente> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Cliente> listarTodos() {
        return repository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existePorCpfCnpj(String cpfCnpj) {
        return repository.existsByCpfCnpj(cpfCnpj);
    }
}
