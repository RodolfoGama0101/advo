package dev.rodolfo.advo.auth.application.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenCommand(
        @NotBlank(message = "Refresh Token é obrigatório")
        String refreshToken
) {
}
