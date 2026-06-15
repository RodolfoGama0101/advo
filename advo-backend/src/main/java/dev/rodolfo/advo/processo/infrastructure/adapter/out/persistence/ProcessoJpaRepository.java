package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProcessoJpaRepository extends JpaRepository<ProcessoJpaEntity, Long> {
    Optional<ProcessoJpaEntity> findByNumeroProcesso(String numeroProcesso);
    boolean existsByNumeroProcesso(String numeroProcesso);
}
