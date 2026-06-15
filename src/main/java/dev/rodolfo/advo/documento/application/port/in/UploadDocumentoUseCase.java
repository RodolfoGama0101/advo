package dev.rodolfo.advo.documento.application.port.in;

import dev.rodolfo.advo.documento.application.dto.DocumentoResponse;
import dev.rodolfo.advo.documento.application.dto.UploadDocumentoCommand;
public interface UploadDocumentoUseCase {

    DocumentoResponse execute(UploadDocumentoCommand input);
}
