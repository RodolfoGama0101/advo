package dev.rodolfo.advo.documento.application.port.out;

import dev.rodolfo.advo.documento.domain.model.Documento;
import java.util.List;
import java.util.Optional;

public interface DocumentoRepositoryPort {
    Documento salvar(Documento documento);
    Optional<Documento> buscarPorId(Long id);
    List<Documento> listarPorProcesso(Long processoId);
}
