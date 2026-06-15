package dev.rodolfo.advo.processo.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Movimentacao extends Entity<Long> {

    private String titulo;
    private String descricao;
    private LocalDate dataMovimentacao;
    private Long usuarioId; // Referência para saber quem adicionou
    private LocalDateTime criadoEm;

    public Movimentacao(Long id, String titulo, String descricao, LocalDate dataMovimentacao, Long usuarioId, LocalDateTime criadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataMovimentacao = dataMovimentacao;
        this.usuarioId = usuarioId;
        this.criadoEm = criadoEm;
    }

    public static Movimentacao criarNova(String titulo, String descricao, LocalDate dataMovimentacao, Long usuarioId) {
        return new Movimentacao(null, titulo, descricao, dataMovimentacao, usuarioId, LocalDateTime.now());
    }

    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDate getDataMovimentacao() { return dataMovimentacao; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
