package dev.rodolfo.advo.cliente.application.port.out;

import dev.rodolfo.advo.cliente.domain.model.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteRepositoryPort {
    Cliente salvar(Cliente cliente);
    Optional<Cliente> buscarPorId(Long id);
    List<Cliente> listarTodos();
    boolean existePorCpfCnpj(String cpfCnpj);
}
