package dev.rodolfo.advo.tarefa.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Tarefa extends Entity<Long> {

    private String titulo;
    private String descricao;
    private StatusTarefa status;
    private PrioridadeTarefa prioridade;
    private LocalDate dataVencimento;
    private Long responsavelId;
    private Long processoId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Tarefa(Long id, String titulo, String descricao, StatusTarefa status, PrioridadeTarefa prioridade, LocalDate dataVencimento, Long responsavelId, Long processoId, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = status;
        this.prioridade = prioridade;
        this.dataVencimento = dataVencimento;
        this.responsavelId = responsavelId;
        this.processoId = processoId;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        validar();
    }

    public static Tarefa criarNova(String titulo, String descricao, PrioridadeTarefa prioridade, LocalDate dataVencimento, Long responsavelId, Long processoId) {
        return new Tarefa(null, titulo, descricao, StatusTarefa.A_FAZER, prioridade != null ? prioridade : PrioridadeTarefa.MEDIA, dataVencimento, responsavelId, processoId, LocalDateTime.now(), LocalDateTime.now());
    }

    private void validar() {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título da tarefa é obrigatório");
        }
        if (responsavelId == null) {
            throw new IllegalArgumentException("Responsável pela tarefa é obrigatório");
        }
    }

    public void alterarStatus(StatusTarefa novoStatus) {
        this.status = novoStatus;
        this.atualizadoEm = LocalDateTime.now();
    }

    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public StatusTarefa getStatus() { return status; }
    public PrioridadeTarefa getPrioridade() { return prioridade; }
    public LocalDate getDataVencimento() { return dataVencimento; }
    public Long getResponsavelId() { return responsavelId; }
    public Long getProcessoId() { return processoId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
