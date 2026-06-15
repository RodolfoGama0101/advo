package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoJpaRepository extends JpaRepository<MovimentacaoJpaEntity, Long> {
}
