package dev.rodolfo.advo.cliente.application.service;

import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.cliente.application.dto.AtualizarClienteCommand;
import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
import dev.rodolfo.advo.cliente.application.dto.CriarClienteCommand;
import dev.rodolfo.advo.cliente.application.port.in.AtualizarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.BuscarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.CriarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.ListarClientesUseCase;
import dev.rodolfo.advo.cliente.application.port.out.ClienteRepositoryPort;
import dev.rodolfo.advo.cliente.domain.exception.ClienteNaoEncontradoException;
import dev.rodolfo.advo.cliente.domain.model.Cliente;
import dev.rodolfo.advo.cliente.domain.model.Endereco;
import dev.rodolfo.advo.shared.domain.DomainException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteApplicationService implements CriarClienteUseCase, AtualizarClienteUseCase, BuscarClienteUseCase, ListarClientesUseCase {

    private final ClienteRepositoryPort repository;

    public ClienteApplicationService(ClienteRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public ClienteResponse execute(CriarClienteCommand input) {
        String cpfCnpjSemMascara = input.cpfCnpj().replaceAll("\\D", "");
        if (repository.existePorCpfCnpj(cpfCnpjSemMascara)) {
            throw new DomainException("Já existe um cliente com este CPF/CNPJ.") {};
        }

        Email email = (input.email() != null && !input.email().isBlank()) ? new Email(input.email()) : null;
        Endereco endereco = new Endereco(input.logradouro(), input.numero(), input.complemento(), input.bairro(), input.cidade(), input.uf(), input.cep());

        Cliente novoCliente = Cliente.criarNovo(
                input.nome(),
                input.tipoPessoa(),
                cpfCnpjSemMascara,
                email,
                input.telefone(),
                endereco,
                input.observacoes()
        );

        Cliente salvo = repository.salvar(novoCliente);
        return mapToResponse(salvo);
    }

    @Override
    @Transactional
    public ClienteResponse execute(AtualizarClienteCommand input) {
        Cliente cliente = repository.buscarPorId(input.id())
                .orElseThrow(() -> new ClienteNaoEncontradoException(input.id()));

        Email email = (input.email() != null && !input.email().isBlank()) ? new Email(input.email()) : null;
        Endereco endereco = new Endereco(input.logradouro(), input.numero(), input.complemento(), input.bairro(), input.cidade(), input.uf(), input.cep());

        cliente.atualizarDados(
                input.nome(),
                email,
                input.telefone(),
                endereco,
                input.observacoes()
        );

        Cliente salvo = repository.salvar(cliente);
        return mapToResponse(salvo);
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse execute(Long id) {
        Cliente cliente = repository.buscarPorId(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
        return mapToResponse(cliente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> execute(Void input) {
        return repository.listarTodos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClienteResponse mapToResponse(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getTipoPessoa(),
                cliente.getCpfCnpj(),
                cliente.getEmail() != null ? cliente.getEmail().getEndereco() : null,
                cliente.getTelefone(),
                cliente.getEndereco().getLogradouro(),
                cliente.getEndereco().getNumero(),
                cliente.getEndereco().getComplemento(),
                cliente.getEndereco().getBairro(),
                cliente.getEndereco().getCidade(),
                cliente.getEndereco().getUf(),
                cliente.getEndereco().getCep(),
                cliente.getStatus(),
                cliente.getObservacoes(),
                cliente.getCriadoEm()
        );
    }
}
