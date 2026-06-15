package dev.rodolfo.advo.auth.infrastructure.adapter.out.security;

import dev.rodolfo.advo.auth.application.port.out.UsuarioRepositoryPort;
import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepositoryPort usuarioRepository;

    public CustomUserDetailsService(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.buscarPorEmail(new Email(username))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        return new CustomUserDetails(usuario);
    }
}
