package dev.rodolfo.advo.financeiro.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.financeiro.domain.model.TransacaoFinanceira;
import org.springframework.stereotype.Component;

@Component
public class TransacaoMapper {

    public TransacaoFinanceira toDomain(TransacaoJpaEntity entity) {
        if (entity == null) return null;
        return new TransacaoFinanceira(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescricao(),
                entity.getTipo(),
                entity.getStatus(),
                entity.getValor(),
                entity.getDataVencimento(),
                entity.getDataPagamento(),
                entity.getProcessoId(),
                entity.getClienteId(),
                entity.getUsuarioId(),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public TransacaoJpaEntity toEntity(TransacaoFinanceira domain) {
        if (domain == null) return null;
        TransacaoJpaEntity entity = new TransacaoJpaEntity();
        entity.setId(domain.getId());
        entity.setTitulo(domain.getTitulo());
        entity.setDescricao(domain.getDescricao());
        entity.setTipo(domain.getTipo());
        entity.setStatus(domain.getStatus());
        entity.setValor(domain.getValor());
        entity.setDataVencimento(domain.getDataVencimento());
        entity.setDataPagamento(domain.getDataPagamento());
        entity.setProcessoId(domain.getProcessoId());
        entity.setClienteId(domain.getClienteId());
        entity.setUsuarioId(domain.getUsuarioId());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
