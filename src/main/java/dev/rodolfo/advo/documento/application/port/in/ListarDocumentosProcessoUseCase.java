package dev.rodolfo.advo.documento.application.port.in;

import dev.rodolfo.advo.documento.application.dto.DocumentoResponse;
import java.util.List;

public interface ListarDocumentosProcessoUseCase {

    List<DocumentoResponse> execute(FiltroDocumentos input);

    record FiltroDocumentos(Long processoId) {}
}
