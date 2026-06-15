package dev.rodolfo.advo.auth.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class CredenciaisInvalidasException extends DomainException {
    public CredenciaisInvalidasException() {
        super("E-mail ou senha inválidos.");
    }
}
