package dev.rodolfo.advo.processo.domain.model;

import dev.rodolfo.advo.shared.domain.ValueObject;
import java.util.regex.Pattern;

public class NumeroProcesso extends ValueObject {

    private static final Pattern PATTERN = Pattern.compile("^\\d{7}-\\d{2}\\.\\d{4}\\.\\d\\.\\d{2}\\.\\d{4}$");
    private final String valor;

    public NumeroProcesso(String valor) {
        if (valor != null && !valor.isBlank()) {
            if (!PATTERN.matcher(valor).matches()) {
                throw new IllegalArgumentException("O número do processo deve seguir o padrão CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO)");
            }
        }
        this.valor = valor; // Pode ser nulo se o processo ainda não foi distribuído
    }

    public String getValor() { return valor; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NumeroProcesso that = (NumeroProcesso) o;
        if (valor == null) return that.valor == null;
        return valor.equals(that.valor);
    }

    @Override
    public int hashCode() {
        return valor != null ? valor.hashCode() : 0;
    }
}
