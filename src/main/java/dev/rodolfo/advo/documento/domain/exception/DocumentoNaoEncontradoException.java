package dev.rodolfo.advo.documento.domain.exception;

import dev.rodolfo.advo.shared.domain.DomainException;

public class DocumentoNaoEncontradoException extends DomainException {
    public DocumentoNaoEncontradoException(Long id) {
        super("Documento não encontrado com o ID: " + id);
    }
}
