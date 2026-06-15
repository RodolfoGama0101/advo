package dev.rodolfo.advo.agenda.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class CompromissoNaoEncontradoException extends DomainException {
    public CompromissoNaoEncontradoException(Long id) {
        super("Compromisso não encontrado com o ID: " + id);
    }
}
