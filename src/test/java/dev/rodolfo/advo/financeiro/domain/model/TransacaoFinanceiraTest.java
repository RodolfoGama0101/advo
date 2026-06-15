package dev.rodolfo.advo.financeiro.domain.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class TransacaoFinanceiraTest {

    @Test
    void deveCriarTransacaoPendenteCorretamente() {
        TransacaoFinanceira transacao = TransacaoFinanceira.criarNova(
                "Honorários Iniciais",
                "Pagamento da primeira parcela",
                TipoTransacao.RECEITA,
                new BigDecimal("5000.00"),
                LocalDate.now().plusDays(10),
                1L,
                1L,
                1L
        );

        assertNotNull(transacao);
        assertEquals(StatusTransacao.PENDENTE, transacao.getStatus());
        assertEquals(TipoTransacao.RECEITA, transacao.getTipo());
        assertNull(transacao.getDataPagamento());
    }

    @Test
    void naoDevePermitirValorNegativoOuZero() {
        assertThrows(IllegalArgumentException.class, () -> {
            TransacaoFinanceira.criarNova(
                    "Taxa",
                    "Taxa zero",
                    TipoTransacao.DESPESA,
                    BigDecimal.ZERO,
                    LocalDate.now().plusDays(10),
                    1L,
                    1L,
                    1L
            );
        });
    }

    @Test
    void devePagarTransacaoCorretamente() {
        TransacaoFinanceira transacao = TransacaoFinanceira.criarNova(
                "Honorários",
                "desc",
                TipoTransacao.RECEITA,
                new BigDecimal("5000.00"),
                LocalDate.now().plusDays(10),
                1L,
                1L,
                1L
        );

        transacao.pagar(LocalDate.now());

        assertEquals(StatusTransacao.PAGO, transacao.getStatus());
        assertNotNull(transacao.getDataPagamento());
    }
}
