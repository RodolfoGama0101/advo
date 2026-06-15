package dev.rodolfo.advo.agenda.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compromisso")
public class CompromissoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descricao;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;

    @Column(name = "local_compromisso")
    private String localCompromisso;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "processo_id")
    private Long processoId;

    @Column(name = "cliente_id")
    private Long clienteId;

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
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataHoraInicio() { return dataHoraInicio; }
    public void setDataHoraInicio(LocalDateTime dataHoraInicio) { this.dataHoraInicio = dataHoraInicio; }
    public LocalDateTime getDataHoraFim() { return dataHoraFim; }
    public void setDataHoraFim(LocalDateTime dataHoraFim) { this.dataHoraFim = dataHoraFim; }
    public String getLocalCompromisso() { return localCompromisso; }
    public void setLocalCompromisso(String localCompromisso) { this.localCompromisso = localCompromisso; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getProcessoId() { return processoId; }
    public void setProcessoId(Long processoId) { this.processoId = processoId; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
