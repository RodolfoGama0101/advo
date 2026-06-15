package dev.rodolfo.advo.auth.application.port.out;

import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Usuario;

import java.util.Optional;

public interface UsuarioRepositoryPort {
    Optional<Usuario> buscarPorEmail(Email email);
    Usuario salvar(Usuario usuario);
    boolean existePorEmail(Email email);
}
