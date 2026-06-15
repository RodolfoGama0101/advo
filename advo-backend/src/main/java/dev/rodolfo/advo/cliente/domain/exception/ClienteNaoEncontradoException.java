package dev.rodolfo.advo.cliente.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class ClienteNaoEncontradoException extends DomainException {
    public ClienteNaoEncontradoException(Long id) {
        super("Cliente não encontrado com o ID: " + id);
    }
}
