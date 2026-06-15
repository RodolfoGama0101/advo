package dev.rodolfo.advo.auth.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Senha;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toDomain(UsuarioJpaEntity entity) {
        if (entity == null) return null;
        
        return new Usuario(
                entity.getId(),
                entity.getNome(),
                new Email(entity.getEmail()),
                Senha.carregarHash(entity.getSenhaHash()),
                entity.getRole(),
                entity.isAtivo(),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public UsuarioJpaEntity toEntity(Usuario domain) {
        if (domain == null) return null;

        UsuarioJpaEntity entity = new UsuarioJpaEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setEmail(domain.getEmail().getEndereco());
        entity.setSenhaHash(domain.getSenha().getValor());
        entity.setRole(domain.getRole());
        entity.setAtivo(domain.isAtivo());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        
        return entity;
    }
}
