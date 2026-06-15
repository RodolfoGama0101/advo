package dev.rodolfo.advo.auth.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.time.LocalDateTime;

public class Usuario extends Entity<Long> {

    private String nome;
    private Email email;
    private Senha senha;
    private Role role;
    private boolean ativo;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Usuario(Long id, String nome, Email email, Senha senha, Role role, boolean ativo, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.role = role;
        this.ativo = ativo;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        validar();
    }

    public static Usuario criarNovo(String nome, Email email, Senha senha, Role role) {
        return new Usuario(null, nome, email, senha, role, true, LocalDateTime.now(), LocalDateTime.now());
    }

    private void validar() {
        if (this.nome == null || this.nome.isBlank()) {
            throw new IllegalArgumentException("O nome do usuário não pode ser vazio");
        }
        if (this.email == null) {
            throw new IllegalArgumentException("O e-mail do usuário é obrigatório");
        }
        if (this.senha == null) {
            throw new IllegalArgumentException("A senha do usuário é obrigatória");
        }
        if (this.role == null) {
            throw new IllegalArgumentException("A role do usuário é obrigatória");
        }
    }

    public void inativar() {
        this.ativo = false;
        this.atualizadoEm = LocalDateTime.now();
    }

    public void ativar() {
        this.ativo = true;
        this.atualizadoEm = LocalDateTime.now();
    }

    public void alterarSenha(Senha novaSenha) {
        this.senha = novaSenha;
        this.atualizadoEm = LocalDateTime.now();
    }
    
    public void alterarRole(Role novaRole) {
        this.role = novaRole;
        this.atualizadoEm = LocalDateTime.now();
    }

    public String getNome() {
        return nome;
    }

    public Email getEmail() {
        return email;
    }

    public Senha getSenha() {
        return senha;
    }

    public Role getRole() {
        return role;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}
