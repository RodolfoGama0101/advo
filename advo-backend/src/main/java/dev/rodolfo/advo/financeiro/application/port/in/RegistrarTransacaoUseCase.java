package dev.rodolfo.advo.financeiro.application.port.in;

import dev.rodolfo.advo.financeiro.application.dto.RegistrarTransacaoCommand;
import dev.rodolfo.advo.financeiro.application.dto.TransacaoResponse;
public interface RegistrarTransacaoUseCase {

    TransacaoResponse execute(RegistrarTransacaoCommand input);
}
