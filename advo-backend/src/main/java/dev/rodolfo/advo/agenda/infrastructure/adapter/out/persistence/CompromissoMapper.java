package dev.rodolfo.advo.agenda.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.agenda.domain.model.Compromisso;
import org.springframework.stereotype.Component;

@Component
public class CompromissoMapper {

    public Compromisso toDomain(CompromissoJpaEntity entity) {
        if (entity == null) return null;
        return new Compromisso(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescricao(),
                entity.getDataHoraInicio(),
                entity.getDataHoraFim(),
                entity.getLocalCompromisso(),
                entity.getUsuarioId(),
                entity.getProcessoId(),
                entity.getClienteId(),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public CompromissoJpaEntity toEntity(Compromisso domain) {
        if (domain == null) return null;
        CompromissoJpaEntity entity = new CompromissoJpaEntity();
        entity.setId(domain.getId());
        entity.setTitulo(domain.getTitulo());
        entity.setDescricao(domain.getDescricao());
        entity.setDataHoraInicio(domain.getDataHoraInicio());
        entity.setDataHoraFim(domain.getDataHoraFim());
        entity.setLocalCompromisso(domain.getLocalCompromisso());
        entity.setUsuarioId(domain.getUsuarioId());
        entity.setProcessoId(domain.getProcessoId());
        entity.setClienteId(domain.getClienteId());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
