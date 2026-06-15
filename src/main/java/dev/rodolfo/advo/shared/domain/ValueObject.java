package dev.rodolfo.advo.shared.domain;

/**
 * Classe base abstrata para todos os Value Objects do domínio.
 * Value Objects não possuem identidade (ID) e são imutáveis.
 * A igualdade de um Value Object é determinada pelos seus atributos.
 * Esta classe serve como um marcador.
 */
public abstract class ValueObject {

    // Value Objects devem implementar equals e hashCode com base em todos os seus campos.
}
