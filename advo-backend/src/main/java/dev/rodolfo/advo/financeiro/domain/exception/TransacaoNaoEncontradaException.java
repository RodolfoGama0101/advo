package dev.rodolfo.advo.financeiro.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class TransacaoNaoEncontradaException extends DomainException {
    public TransacaoNaoEncontradaException(Long id) {
        super("Transação não encontrada com o ID: " + id);
    }
}
