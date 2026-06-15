package dev.rodolfo.advo.tarefa.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TarefaJpaRepository extends JpaRepository<TarefaJpaEntity, Long> {
    List<TarefaJpaEntity> findByResponsavelId(Long responsavelId);
    List<TarefaJpaEntity> findByProcessoId(Long processoId);
}
