package dev.rodolfo.advo.auth.infrastructure.adapter.out.security;

import dev.rodolfo.advo.auth.application.port.out.TokenProviderPort;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider implements TokenProviderPort {

    private final SecretKey key;
    private final long jwtExpirationMs;
    private final long jwtRefreshExpirationMs;

    public JwtTokenProvider(
            @Value("${advo.security.jwt.secret}") String jwtSecret,
            @Value("${advo.security.jwt.expiration-ms}") long jwtExpirationMs,
            @Value("${advo.security.jwt.refresh-expiration-ms}") long jwtRefreshExpirationMs) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
        this.jwtRefreshExpirationMs = jwtRefreshExpirationMs;
    }

    @Override
    public String gerarAccessToken(Usuario usuario) {
        return buildToken(usuario, jwtExpirationMs);
    }

    @Override
    public String gerarRefreshToken(Usuario usuario) {
        return buildToken(usuario, jwtRefreshExpirationMs);
    }

    private String buildToken(Usuario usuario, long expirationMs) {
        return Jwts.builder()
                .subject(usuario.getEmail().getEndereco())
                .claim("role", "ROLE_" + usuario.getRole().name())
                .claim("id", usuario.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    @Override
    public String obterSubjectDoToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    @Override
    public boolean isTokenValido(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
