package dev.rodolfo.advo.shared.domain;

import java.util.Objects;

/**
 * Classe base abstrata para todas as Entidades do domínio.
 * Identidade é definida unicamente pelo ID.
 */
public abstract class Entity<T> {

    protected T id;

    public T getId() {
        return id;
    }

    public void setId(T id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Entity<?> entity = (Entity<?>) o;
        return id != null && Objects.equals(id, entity.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : super.hashCode();
    }
}
