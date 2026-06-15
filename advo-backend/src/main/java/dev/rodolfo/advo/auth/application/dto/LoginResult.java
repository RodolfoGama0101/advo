package dev.rodolfo.advo.auth.application.dto;

public record LoginResult(
        String accessToken,
        String refreshToken,
        Long expiresIn
) {
}
