package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.processo.domain.model.Movimentacao;
import dev.rodolfo.advo.processo.domain.model.NumeroProcesso;
import dev.rodolfo.advo.processo.domain.model.ParteContraria;
import dev.rodolfo.advo.processo.domain.model.Processo;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProcessoMapper {

    public Processo toDomain(ProcessoJpaEntity entity) {
        if (entity == null) return null;

        NumeroProcesso numeroProcesso = entity.getNumeroProcesso() != null && !entity.getNumeroProcesso().isBlank()
                ? new NumeroProcesso(entity.getNumeroProcesso()) : null;

        List<ParteContraria> partes = entity.getPartesContrarias() != null ? entity.getPartesContrarias().stream()
                .map(p -> new ParteContraria(p.getId(), p.getNome(), p.getCpfCnpj(), p.getTipoParte(), p.getAdvogadoContrario(), p.getOabAdvogadoContrario()))
                .collect(Collectors.toList()) : new ArrayList<>();

        List<Movimentacao> movimentacoes = entity.getMovimentacoes() != null ? entity.getMovimentacoes().stream()
                .map(m -> new Movimentacao(m.getId(), m.getTitulo(), m.getDescricao(), m.getDataMovimentacao(), m.getUsuarioId(), m.getCriadoEm()))
                .collect(Collectors.toList()) : new ArrayList<>();

        return new Processo(
                entity.getId(),
                numeroProcesso,
                entity.getTitulo(),
                entity.getTribunal(),
                entity.getVara(),
                entity.getFaseProcessual(),
                entity.getStatus(),
                entity.getDescricao(),
                entity.getClienteId(),
                entity.getAreaDireitoId(),
                entity.getDataDistribuicao(),
                entity.getValorCausa(),
                partes,
                movimentacoes,
                new ArrayList<>(entity.getAdvogadosResponsaveisIds()),
                entity.getCriadoEm(),
                entity.getAtualizadoEm()
        );
    }

    public ProcessoJpaEntity toEntity(Processo domain) {
        if (domain == null) return null;

        ProcessoJpaEntity entity = new ProcessoJpaEntity();
        entity.setId(domain.getId());
        entity.setNumeroProcesso(domain.getNumeroProcesso() != null ? domain.getNumeroProcesso().getValor() : null);
        entity.setTitulo(domain.getTitulo());
        entity.setTribunal(domain.getTribunal());
        entity.setVara(domain.getVara());
        entity.setFaseProcessual(domain.getFaseProcessual());
        entity.setStatus(domain.getStatus());
        entity.setDescricao(domain.getDescricao());
        entity.setClienteId(domain.getClienteId());
        entity.setAreaDireitoId(domain.getAreaDireitoId());
        entity.setDataDistribuicao(domain.getDataDistribuicao());
        entity.setValorCausa(domain.getValorCausa());
        
        if (domain.getAdvogadosResponsaveisIds() != null) {
            entity.setAdvogadosResponsaveisIds(new ArrayList<>(domain.getAdvogadosResponsaveisIds()));
        }

        if (domain.getPartesContrarias() != null) {
            domain.getPartesContrarias().forEach(p -> {
                ParteContrariaJpaEntity pe = new ParteContrariaJpaEntity();
                pe.setId(p.getId());
                pe.setNome(p.getNome());
                pe.setCpfCnpj(p.getCpfCnpj());
                pe.setTipoParte(p.getTipoParte());
                pe.setAdvogadoContrario(p.getAdvogadoContrario());
                pe.setOabAdvogadoContrario(p.getOabAdvogadoContrario());
                entity.addParteContraria(pe);
            });
        }

        if (domain.getMovimentacoes() != null) {
            domain.getMovimentacoes().forEach(m -> {
                MovimentacaoJpaEntity me = new MovimentacaoJpaEntity();
                me.setId(m.getId());
                me.setTitulo(m.getTitulo());
                me.setDescricao(m.getDescricao());
                me.setDataMovimentacao(m.getDataMovimentacao());
                me.setUsuarioId(m.getUsuarioId());
                me.setCriadoEm(m.getCriadoEm());
                entity.addMovimentacao(me);
            });
        }

        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());

        return entity;
    }
}
