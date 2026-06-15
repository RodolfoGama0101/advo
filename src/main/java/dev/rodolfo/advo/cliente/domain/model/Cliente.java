package dev.rodolfo.advo.cliente.domain.model;

import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.shared.domain.Entity;

import java.time.LocalDateTime;

public class Cliente extends Entity<Long> {

    private String nome;
    private TipoPessoa tipoPessoa;
    private String cpfCnpj; // Pode ser instância de Cpf ou Cnpj na lógica se necessário
    private Email email;
    private String telefone;
    private Endereco endereco;
    private StatusCliente status;
    private String observacoes;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Cliente(Long id, String nome, TipoPessoa tipoPessoa, String cpfCnpj, Email email, String telefone, Endereco endereco, StatusCliente status, String observacoes, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.tipoPessoa = tipoPessoa;
        this.cpfCnpj = cpfCnpj;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
        this.status = status;
        this.observacoes = observacoes;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        validar();
    }

    public static Cliente criarNovo(String nome, TipoPessoa tipoPessoa, String cpfCnpj, Email email, String telefone, Endereco endereco, String observacoes) {
        return new Cliente(null, nome, tipoPessoa, cpfCnpj, email, telefone, endereco, StatusCliente.ATIVO, observacoes, LocalDateTime.now(), LocalDateTime.now());
    }

    private void validar() {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório");
        }
        if (tipoPessoa == null) {
            throw new IllegalArgumentException("Tipo de pessoa é obrigatório");
        }
        if (cpfCnpj == null || cpfCnpj.isBlank()) {
            throw new IllegalArgumentException("CPF/CNPJ é obrigatório");
        }
        if (tipoPessoa == TipoPessoa.PF) {
            new Cpf(cpfCnpj); // Apenas para validar
        } else {
            new Cnpj(cpfCnpj); // Apenas para validar
        }
    }

    public void atualizarDados(String nome, Email email, String telefone, Endereco endereco, String observacoes) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
        this.observacoes = observacoes;
        this.atualizadoEm = LocalDateTime.now();
        validar();
    }

    public void alterarStatus(StatusCliente novoStatus) {
        this.status = novoStatus;
        this.atualizadoEm = LocalDateTime.now();
    }

    public String getNome() { return nome; }
    public TipoPessoa getTipoPessoa() { return tipoPessoa; }
    public String getCpfCnpj() { return cpfCnpj; }
    public Email getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public Endereco getEndereco() { return endereco; }
    public StatusCliente getStatus() { return status; }
    public String getObservacoes() { return observacoes; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
