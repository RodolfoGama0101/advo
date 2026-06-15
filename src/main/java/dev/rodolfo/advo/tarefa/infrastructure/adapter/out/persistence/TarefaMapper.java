package dev.rodolfo.advo.tarefa.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.tarefa.domain.model.Tarefa;
import org.springframework.stereotype.Component;

@Component
public class TarefaMapper {

    public Tarefa toDomain(TarefaJpaEntity entity) {
        if (entity == null) return null;
        return new Tarefa(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescricao(),
                entity.getStatus(),
                entity.getPrioridade(),
                entity.getDataVencimento(),
                entity.getResponsavelId(),
                entity.getProcessoId(),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public TarefaJpaEntity toEntity(Tarefa domain) {
        if (domain == null) return null;
        TarefaJpaEntity entity = new TarefaJpaEntity();
        entity.setId(domain.getId());
        entity.setTitulo(domain.getTitulo());
        entity.setDescricao(domain.getDescricao());
        entity.setStatus(domain.getStatus());
        entity.setPrioridade(domain.getPrioridade());
        entity.setDataVencimento(domain.getDataVencimento());
        entity.setResponsavelId(domain.getResponsavelId());
        entity.setProcessoId(domain.getProcessoId());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
