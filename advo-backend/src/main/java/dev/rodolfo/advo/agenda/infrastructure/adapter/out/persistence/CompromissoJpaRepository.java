package dev.rodolfo.advo.agenda.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CompromissoJpaRepository extends JpaRepository<CompromissoJpaEntity, Long> {
    
    @Query("SELECT c FROM CompromissoJpaEntity c WHERE c.usuarioId = :usuarioId AND " +
           "(c.dataHoraInicio >= :inicio AND c.dataHoraInicio <= :fim OR " +
           "c.dataHoraFim >= :inicio AND c.dataHoraFim <= :fim)")
    List<CompromissoJpaEntity> findByUsuarioIdAndPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);
}
