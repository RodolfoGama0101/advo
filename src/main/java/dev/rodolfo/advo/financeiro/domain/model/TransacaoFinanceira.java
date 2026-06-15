package dev.rodolfo.advo.financeiro.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransacaoFinanceira extends Entity<Long> {

    private String titulo;
    private String descricao;
    private TipoTransacao tipo;
    private StatusTransacao status;
    private BigDecimal valor;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private Long processoId;
    private Long clienteId;
    private Long usuarioId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public TransacaoFinanceira(Long id, String titulo, String descricao, TipoTransacao tipo, StatusTransacao status, BigDecimal valor, LocalDate dataVencimento, LocalDate dataPagamento, Long processoId, Long clienteId, Long usuarioId, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo = tipo;
        this.status = status;
        this.valor = valor;
        this.dataVencimento = dataVencimento;
        this.dataPagamento = dataPagamento;
        this.processoId = processoId;
        this.clienteId = clienteId;
        this.usuarioId = usuarioId;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        validar();
    }

    public static TransacaoFinanceira criarNova(String titulo, String descricao, TipoTransacao tipo, BigDecimal valor, LocalDate dataVencimento, Long processoId, Long clienteId, Long usuarioId) {
        return new TransacaoFinanceira(null, titulo, descricao, tipo, StatusTransacao.PENDENTE, valor, dataVencimento, null, processoId, clienteId, usuarioId, LocalDateTime.now(), LocalDateTime.now());
    }

    private void validar() {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório");
        }
        if (tipo == null) {
            throw new IllegalArgumentException("Tipo de transação é obrigatório");
        }
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor da transação deve ser maior que zero");
        }
        if (dataVencimento == null) {
            throw new IllegalArgumentException("Data de vencimento é obrigatória");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("Usuário responsável é obrigatório");
        }
    }

    public void pagar(LocalDate dataPagamento) {
        if (this.status == StatusTransacao.PAGO) {
            throw new IllegalStateException("A transação já está paga");
        }
        if (this.status == StatusTransacao.CANCELADO) {
            throw new IllegalStateException("A transação está cancelada");
        }
        this.status = StatusTransacao.PAGO;
        this.dataPagamento = dataPagamento != null ? dataPagamento : LocalDate.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    public void cancelar() {
        if (this.status == StatusTransacao.PAGO) {
            throw new IllegalStateException("Não é possível cancelar uma transação já paga");
        }
        this.status = StatusTransacao.CANCELADO;
        this.atualizadoEm = LocalDateTime.now();
    }

    public void verificarAtraso() {
        if (this.status == StatusTransacao.PENDENTE && LocalDate.now().isAfter(this.dataVencimento)) {
            this.status = StatusTransacao.ATRASADO;
            this.atualizadoEm = LocalDateTime.now();
        }
    }

    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public TipoTransacao getTipo() { return tipo; }
    public StatusTransacao getStatus() { return status; }
    public BigDecimal getValor() { return valor; }
    public LocalDate getDataVencimento() { return dataVencimento; }
    public LocalDate getDataPagamento() { return dataPagamento; }
    public Long getProcessoId() { return processoId; }
    public Long getClienteId() { return clienteId; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
