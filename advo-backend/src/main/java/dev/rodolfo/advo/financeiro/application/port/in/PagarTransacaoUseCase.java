package dev.rodolfo.advo.financeiro.application.port.in;

import dev.rodolfo.advo.financeiro.application.dto.PagarTransacaoCommand;
public interface PagarTransacaoUseCase {

    Void execute(PagarTransacaoCommand input);
}
