package dev.rodolfo.advo.auth.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class UsuarioNaoEncontradoException extends DomainException {
    public UsuarioNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
