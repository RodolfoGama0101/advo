package dev.rodolfo.advo.cliente.domain.model;

import dev.rodolfo.advo.shared.domain.ValueObject;

public class Cnpj extends ValueObject {
    private final String valor;

    public Cnpj(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("CNPJ não pode ser vazio");
        }
        String numeros = valor.replaceAll("\\D", "");
        if (numeros.length() != 14) {
            throw new IllegalArgumentException("CNPJ deve conter 14 dígitos");
        }
        // Validação completa de dígitos verificadores (simplificado)
        this.valor = numeros;
    }

    public String getValorFormatado() {
        return valor.replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cnpj cnpj = (Cnpj) o;
        return valor.equals(cnpj.valor);
    }

    @Override
    public int hashCode() {
        return valor.hashCode();
    }
}
