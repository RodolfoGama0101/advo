package dev.rodolfo.advo.tarefa.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class TarefaNaoEncontradaException extends DomainException {
    public TarefaNaoEncontradaException(Long id) {
        super("Tarefa não encontrada com o ID: " + id);
    }
}
