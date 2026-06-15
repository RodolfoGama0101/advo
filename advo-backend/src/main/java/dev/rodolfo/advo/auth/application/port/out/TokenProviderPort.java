package dev.rodolfo.advo.auth.application.port.out;

import dev.rodolfo.advo.auth.domain.model.Usuario;

public interface TokenProviderPort {
    String gerarAccessToken(Usuario usuario);
    String gerarRefreshToken(Usuario usuario);
    String obterSubjectDoToken(String token);
    boolean isTokenValido(String token);
}
