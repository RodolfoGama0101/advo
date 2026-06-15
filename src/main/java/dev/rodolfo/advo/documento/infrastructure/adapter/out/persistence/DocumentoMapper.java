package dev.rodolfo.advo.documento.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.documento.domain.model.Documento;
import org.springframework.stereotype.Component;

@Component
public class DocumentoMapper {

    public Documento toDomain(DocumentoJpaEntity entity) {
        if (entity == null) return null;
        return new Documento(
                entity.getId(),
                entity.getNomeOriginal(),
                entity.getCaminhoArquivo(),
                entity.getTamanhoBytes(),
                entity.getTipoMime(),
                entity.getProcessoId(),
                entity.getUsuarioId(),
                entity.getCriadoEm()
        );
    }

    public DocumentoJpaEntity toEntity(Documento domain) {
        if (domain == null) return null;
        DocumentoJpaEntity entity = new DocumentoJpaEntity();
        entity.setId(domain.getId());
        entity.setNomeOriginal(domain.getNomeOriginal());
        entity.setCaminhoArquivo(domain.getCaminhoArquivo());
        entity.setTamanhoBytes(domain.getTamanhoBytes());
        entity.setTipoMime(domain.getTipoMime());
        entity.setProcessoId(domain.getProcessoId());
        entity.setUsuarioId(domain.getUsuarioId());
        entity.setCriadoEm(domain.getCriadoEm());
        return entity;
    }
}
