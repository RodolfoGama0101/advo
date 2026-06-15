package dev.rodolfo.advo.processo.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class ProcessoNaoEncontradoException extends DomainException {
    public ProcessoNaoEncontradoException(Long id) {
        super("Processo não encontrado com o ID: " + id);
    }
}
