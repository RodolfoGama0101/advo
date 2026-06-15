package dev.rodolfo.advo.auth.domain.service;

import dev.rodolfo.advo.auth.domain.exception.CredenciaisInvalidasException;
import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import dev.rodolfo.advo.auth.application.port.out.PasswordEncoderPort;
import dev.rodolfo.advo.auth.application.port.out.UsuarioRepositoryPort;

public class AutenticacaoService {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoderPort passwordEncoder;

    public AutenticacaoService(UsuarioRepositoryPort usuarioRepository, PasswordEncoderPort passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario autenticar(Email email, String senhaAberta) {
        Usuario usuario = usuarioRepository.buscarPorEmail(email)
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!usuario.isAtivo()) {
            throw new CredenciaisInvalidasException();
        }

        if (!passwordEncoder.matches(senhaAberta, usuario.getSenha().getValor())) {
            throw new CredenciaisInvalidasException();
        }

        return usuario;
    }
}
