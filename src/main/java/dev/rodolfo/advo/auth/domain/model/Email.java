package dev.rodolfo.advo.auth.domain.model;

import dev.rodolfo.advo.shared.domain.ValueObject;
import java.util.regex.Pattern;

public class Email extends ValueObject {
    private static final Pattern PATTERN = Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");
    private final String endereco;

    public Email(String endereco) {
        if (endereco == null || endereco.isBlank()) {
            throw new IllegalArgumentException("E-mail não pode ser vazio");
        }
        if (!PATTERN.matcher(endereco).matches()) {
            throw new IllegalArgumentException("E-mail com formato inválido");
        }
        this.endereco = endereco.toLowerCase();
    }

    public String getEndereco() {
        return endereco;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Email email = (Email) o;
        return endereco.equals(email.endereco);
    }

    @Override
    public int hashCode() {
        return endereco.hashCode();
    }
}
