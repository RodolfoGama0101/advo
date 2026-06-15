package dev.rodolfo.advo.processo.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;

@Entity
@Table(name = "parte_contraria")
public class ParteContrariaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processo_id", nullable = false)
    private ProcessoJpaEntity processo;

    @Column(nullable = false)
    private String nome;

    @Column(name = "cpf_cnpj")
    private String cpfCnpj;

    @Column(name = "tipo_parte", nullable = false)
    private String tipoParte;

    @Column(name = "advogado_contrario")
    private String advogadoContrario;

    @Column(name = "oab_advogado_contrario")
    private String oabAdvogadoContrario;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProcessoJpaEntity getProcesso() { return processo; }
    public void setProcesso(ProcessoJpaEntity processo) { this.processo = processo; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpfCnpj() { return cpfCnpj; }
    public void setCpfCnpj(String cpfCnpj) { this.cpfCnpj = cpfCnpj; }
    public String getTipoParte() { return tipoParte; }
    public void setTipoParte(String tipoParte) { this.tipoParte = tipoParte; }
    public String getAdvogadoContrario() { return advogadoContrario; }
    public void setAdvogadoContrario(String advogadoContrario) { this.advogadoContrario = advogadoContrario; }
    public String getOabAdvogadoContrario() { return oabAdvogadoContrario; }
    public void setOabAdvogadoContrario(String oabAdvogadoContrario) { this.oabAdvogadoContrario = oabAdvogadoContrario; }
}
