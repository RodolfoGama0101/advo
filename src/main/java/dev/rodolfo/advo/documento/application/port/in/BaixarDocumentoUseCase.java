package dev.rodolfo.advo.documento.application.port.in;

import dev.rodolfo.advo.documento.application.dto.DocumentoArquivoDTO;
public interface BaixarDocumentoUseCase {

    DocumentoArquivoDTO execute(Long input);
}
