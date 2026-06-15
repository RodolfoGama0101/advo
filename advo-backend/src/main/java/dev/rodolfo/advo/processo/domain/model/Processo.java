package dev.rodolfo.advo.processo.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Processo extends Entity<Long> {

    private NumeroProcesso numeroProcesso;
    private String titulo;
    private String tribunal;
    private String vara;
    private FaseProcessual faseProcessual;
    private StatusProcesso status;
    private String descricao;
    private Long clienteId;
    private Long areaDireitoId;
    private LocalDate dataDistribuicao;
    private BigDecimal valorCausa;
    private List<ParteContraria> partesContrarias;
    private List<Movimentacao> movimentacoes;
    private List<Long> advogadosResponsaveisIds;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Processo(Long id, NumeroProcesso numeroProcesso, String titulo, String tribunal, String vara, FaseProcessual faseProcessual, StatusProcesso status, String descricao, Long clienteId, Long areaDireitoId, LocalDate dataDistribuicao, BigDecimal valorCausa, List<ParteContraria> partesContrarias, List<Movimentacao> movimentacoes, List<Long> advogadosResponsaveisIds, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.numeroProcesso = numeroProcesso;
        this.titulo = titulo;
        this.tribunal = tribunal;
        this.vara = vara;
        this.faseProcessual = faseProcessual;
        this.status = status;
        this.descricao = descricao;
        this.clienteId = clienteId;
        this.areaDireitoId = areaDireitoId;
        this.dataDistribuicao = dataDistribuicao;
        this.valorCausa = valorCausa;
        this.partesContrarias = partesContrarias != null ? partesContrarias : new ArrayList<>();
        this.movimentacoes = movimentacoes != null ? movimentacoes : new ArrayList<>();
        this.advogadosResponsaveisIds = advogadosResponsaveisIds != null ? advogadosResponsaveisIds : new ArrayList<>();
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    public static Processo criarNovo(NumeroProcesso numeroProcesso, String titulo, String tribunal, String vara, String descricao, Long clienteId, Long areaDireitoId, LocalDate dataDistribuicao, BigDecimal valorCausa, List<ParteContraria> partesContrarias, List<Long> advogadosResponsaveisIds) {
        return new Processo(null, numeroProcesso, titulo, tribunal, vara, FaseProcessual.INICIAL, StatusProcesso.ATIVO, descricao, clienteId, areaDireitoId, dataDistribuicao, valorCausa, partesContrarias, new ArrayList<>(), advogadosResponsaveisIds, LocalDateTime.now(), LocalDateTime.now());
    }

    public void adicionarMovimentacao(Movimentacao movimentacao) {
        this.movimentacoes.add(movimentacao);
        this.atualizadoEm = LocalDateTime.now();
    }

    public void alterarFase(FaseProcessual novaFase) {
        this.faseProcessual = novaFase;
        this.atualizadoEm = LocalDateTime.now();
    }

    public void alterarStatus(StatusProcesso novoStatus) {
        this.status = novoStatus;
        this.atualizadoEm = LocalDateTime.now();
    }

    public NumeroProcesso getNumeroProcesso() { return numeroProcesso; }
    public String getTitulo() { return titulo; }
    public String getTribunal() { return tribunal; }
    public String getVara() { return vara; }
    public FaseProcessual getFaseProcessual() { return faseProcessual; }
    public StatusProcesso getStatus() { return status; }
    public String getDescricao() { return descricao; }
    public Long getClienteId() { return clienteId; }
    public Long getAreaDireitoId() { return areaDireitoId; }
    public LocalDate getDataDistribuicao() { return dataDistribuicao; }
    public BigDecimal getValorCausa() { return valorCausa; }
    public List<ParteContraria> getPartesContrarias() { return partesContrarias; }
    public List<Movimentacao> getMovimentacoes() { return movimentacoes; }
    public List<Long> getAdvogadosResponsaveisIds() { return advogadosResponsaveisIds; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
