package dev.rodolfo.advo.processo.application.port.in;

import dev.rodolfo.advo.processo.application.dto.CriarProcessoCommand;
import dev.rodolfo.advo.processo.application.dto.ProcessoResponse;
public interface CriarProcessoUseCase {

    ProcessoResponse execute(CriarProcessoCommand input);
}
