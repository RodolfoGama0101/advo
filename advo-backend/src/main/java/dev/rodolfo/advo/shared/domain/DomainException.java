package dev.rodolfo.advo.shared.domain;

/**
 * Exceção base para erros de regras de negócio do domínio.
 */
public abstract class DomainException extends RuntimeException {

    protected DomainException(String message) {
        super(message);
    }

    protected DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}
