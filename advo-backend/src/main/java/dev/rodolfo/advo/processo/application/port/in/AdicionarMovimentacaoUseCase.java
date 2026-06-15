package dev.rodolfo.advo.processo.application.port.in;

import dev.rodolfo.advo.processo.application.dto.MovimentacaoCommand;
public interface AdicionarMovimentacaoUseCase {

    Void execute(MovimentacaoCommand input);
}
