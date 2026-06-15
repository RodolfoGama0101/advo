package dev.rodolfo.advo.auth.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginCommand(
        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail com formato inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha
) {
}
