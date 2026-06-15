package dev.rodolfo.advo.cliente.domain.model;

import dev.rodolfo.advo.shared.domain.ValueObject;

public class Cpf extends ValueObject {
    private final String valor;

    public Cpf(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("CPF não pode ser vazio");
        }
        String numeros = valor.replaceAll("\\D", "");
        if (numeros.length() != 11) {
            throw new IllegalArgumentException("CPF deve conter 11 dígitos");
        }
        // Validação completa de dígitos verificadores seria implementada aqui (simplificado)
        this.valor = numeros;
    }

    public String getValorFormatado() {
        return valor.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cpf cpf = (Cpf) o;
        return valor.equals(cpf.valor);
    }

    @Override
    public int hashCode() {
        return valor.hashCode();
    }
}
