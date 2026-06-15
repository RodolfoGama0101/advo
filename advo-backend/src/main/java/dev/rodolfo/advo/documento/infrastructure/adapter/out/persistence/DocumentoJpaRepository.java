package dev.rodolfo.advo.documento.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentoJpaRepository extends JpaRepository<DocumentoJpaEntity, Long> {
    List<DocumentoJpaEntity> findByProcessoId(Long processoId);
}
