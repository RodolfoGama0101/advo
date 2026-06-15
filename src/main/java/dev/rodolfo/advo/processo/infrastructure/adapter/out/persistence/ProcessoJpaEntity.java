package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import dev.rodolfo.advo.processo.domain.model.FaseProcessual;
import dev.rodolfo.advo.processo.domain.model.StatusProcesso;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "processo")
public class ProcessoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_processo", unique = true)
    private String numeroProcesso;

    @Column(nullable = false)
    private String titulo;

    private String tribunal;
    private String vara;

    @Enumerated(EnumType.STRING)
    @Column(name = "fase_processual", nullable = false)
    private FaseProcessual faseProcessual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProcesso status;

    private String descricao;

    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    @Column(name = "area_direito_id")
    private Long areaDireitoId;

    @Column(name = "data_distribuicao")
    private LocalDate dataDistribuicao;

    @Column(name = "valor_causa")
    private BigDecimal valorCausa;

    @OneToMany(mappedBy = "processo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParteContrariaJpaEntity> partesContrarias = new ArrayList<>();

    @OneToMany(mappedBy = "processo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovimentacaoJpaEntity> movimentacoes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "processo_advogado", joinColumns = @JoinColumn(name = "processo_id"))
    @Column(name = "usuario_id")
    private List<Long> advogadosResponsaveisIds = new ArrayList<>();

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        if (criadoEm == null) criadoEm = LocalDateTime.now();
        atualizadoEm = criadoEm;
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroProcesso() { return numeroProcesso; }
    public void setNumeroProcesso(String numeroProcesso) { this.numeroProcesso = numeroProcesso; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getTribunal() { return tribunal; }
    public void setTribunal(String tribunal) { this.tribunal = tribunal; }
    public String getVara() { return vara; }
    public void setVara(String vara) { this.vara = vara; }
    public FaseProcessual getFaseProcessual() { return faseProcessual; }
    public void setFaseProcessual(FaseProcessual faseProcessual) { this.faseProcessual = faseProcessual; }
    public StatusProcesso getStatus() { return status; }
    public void setStatus(StatusProcesso status) { this.status = status; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getAreaDireitoId() { return areaDireitoId; }
    public void setAreaDireitoId(Long areaDireitoId) { this.areaDireitoId = areaDireitoId; }
    public LocalDate getDataDistribuicao() { return dataDistribuicao; }
    public void setDataDistribuicao(LocalDate dataDistribuicao) { this.dataDistribuicao = dataDistribuicao; }
    public BigDecimal getValorCausa() { return valorCausa; }
    public void setValorCausa(BigDecimal valorCausa) { this.valorCausa = valorCausa; }
    public List<ParteContrariaJpaEntity> getPartesContrarias() { return partesContrarias; }
    public void setPartesContrarias(List<ParteContrariaJpaEntity> partesContrarias) { this.partesContrarias = partesContrarias; }
    public void addParteContraria(ParteContrariaJpaEntity parte) {
        partesContrarias.add(parte);
        parte.setProcesso(this);
    }
    public List<MovimentacaoJpaEntity> getMovimentacoes() { return movimentacoes; }
    public void setMovimentacoes(List<MovimentacaoJpaEntity> movimentacoes) { this.movimentacoes = movimentacoes; }
    public void addMovimentacao(MovimentacaoJpaEntity mov) {
        movimentacoes.add(mov);
        mov.setProcesso(this);
    }
    public List<Long> getAdvogadosResponsaveisIds() { return advogadosResponsaveisIds; }
    public void setAdvogadosResponsaveisIds(List<Long> advogadosResponsaveisIds) { this.advogadosResponsaveisIds = advogadosResponsaveisIds; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
