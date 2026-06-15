package dev.rodolfo.advo.cliente.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.cliente.domain.model.Cliente;
import dev.rodolfo.advo.cliente.domain.model.Endereco;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toDomain(ClienteJpaEntity entity) {
        if (entity == null) return null;

        Email email = (entity.getEmail() != null && !entity.getEmail().isBlank()) ? new Email(entity.getEmail()) : null;
        Endereco endereco = new Endereco(
                entity.getLogradouro(),
                entity.getNumero(),
                entity.getComplemento(),
                entity.getBairro(),
                entity.getCidade(),
                entity.getUf(),
                entity.getCep()
        );

        return new Cliente(
                entity.getId(),
                entity.getNome(),
                entity.getTipoPessoa(),
                entity.getCpfCnpj(),
                email,
                entity.getTelefone(),
                endereco,
                entity.getStatus(),
                entity.getObservacoes(),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public ClienteJpaEntity toEntity(Cliente domain) {
        if (domain == null) return null;

        ClienteJpaEntity entity = new ClienteJpaEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setTipoPessoa(domain.getTipoPessoa());
        entity.setCpfCnpj(domain.getCpfCnpj());
        entity.setEmail(domain.getEmail() != null ? domain.getEmail().getEndereco() : null);
        entity.setTelefone(domain.getTelefone());
        
        if (domain.getEndereco() != null) {
            entity.setLogradouro(domain.getEndereco().getLogradouro());
            entity.setNumero(domain.getEndereco().getNumero());
            entity.setComplemento(domain.getEndereco().getComplemento());
            entity.setBairro(domain.getEndereco().getBairro());
            entity.setCidade(domain.getEndereco().getCidade());
            entity.setUf(domain.getEndereco().getUf());
            entity.setCep(domain.getEndereco().getCep());
        }

        entity.setStatus(domain.getStatus());
        entity.setObservacoes(domain.getObservacoes());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());

        return entity;
    }
}
