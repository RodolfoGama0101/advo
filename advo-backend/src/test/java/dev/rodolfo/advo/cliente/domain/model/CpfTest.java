package dev.rodolfo.advo.cliente.domain.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CpfTest {

    @Test
    void deveAceitarCpfValido() {
        Cpf cpf = new Cpf("123.456.789-00");
        assertEquals("12345678900", cpf.getValor());
    }

    @Test
    void naoDeveAceitarCpfInvalido() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Cpf("123456789");
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            new Cpf("ABC.DEF.GHI-JK");
        });
    }
}
