package dev.rodolfo.advo.agenda.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.time.LocalDateTime;

public class Compromisso extends Entity<Long> {

    private String titulo;
    private String descricao;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private String localCompromisso;
    private Long usuarioId;
    private Long processoId;
    private Long clienteId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Compromisso(Long id, String titulo, String descricao, LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim, String localCompromisso, Long usuarioId, Long processoId, Long clienteId, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataHoraInicio = dataHoraInicio;
        this.dataHoraFim = dataHoraFim;
        this.localCompromisso = localCompromisso;
        this.usuarioId = usuarioId;
        this.processoId = processoId;
        this.clienteId = clienteId;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        validar();
    }

    public static Compromisso criarNovo(String titulo, String descricao, LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim, String localCompromisso, Long usuarioId, Long processoId, Long clienteId) {
        return new Compromisso(null, titulo, descricao, dataHoraInicio, dataHoraFim, localCompromisso, usuarioId, processoId, clienteId, LocalDateTime.now(), LocalDateTime.now());
    }

    private void validar() {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título do compromisso é obrigatório");
        }
        if (dataHoraInicio == null || dataHoraFim == null) {
            throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
        }
        if (dataHoraFim.isBefore(dataHoraInicio)) {
            throw new IllegalArgumentException("Data de fim não pode ser anterior à data de início");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("Usuário responsável pelo compromisso é obrigatório");
        }
    }

    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDateTime getDataHoraInicio() { return dataHoraInicio; }
    public LocalDateTime getDataHoraFim() { return dataHoraFim; }
    public String getLocalCompromisso() { return localCompromisso; }
    public Long getUsuarioId() { return usuarioId; }
    public Long getProcessoId() { return processoId; }
    public Long getClienteId() { return clienteId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
