package dev.rodolfo.advo.financeiro.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoJpaRepository extends JpaRepository<TransacaoJpaEntity, Long> {
    List<TransacaoJpaEntity> findByProcessoId(Long processoId);
    List<TransacaoJpaEntity> findByClienteId(Long clienteId);
}
