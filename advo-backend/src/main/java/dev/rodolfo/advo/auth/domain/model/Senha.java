package dev.rodolfo.advo.auth.domain.model;

import dev.rodolfo.advo.shared.domain.ValueObject;

public class Senha extends ValueObject {

    private final String valor;

    private Senha(String valor) {
        this.valor = valor;
    }

    public static Senha criar(String senhaAberta) {
        if (senhaAberta == null || senhaAberta.isBlank()) {
            throw new IllegalArgumentException("A senha não pode ser vazia");
        }
        if (senhaAberta.length() < 8) {
            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres");
        }
        return new Senha(senhaAberta);
    }

    public static Senha carregarHash(String senhaHash) {
        if (senhaHash == null || senhaHash.isBlank()) {
            throw new IllegalArgumentException("O hash da senha não pode ser vazio");
        }
        return new Senha(senhaHash);
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Senha senha = (Senha) o;
        return valor.equals(senha.valor);
    }

    @Override
    public int hashCode() {
        return valor.hashCode();
    }
}
