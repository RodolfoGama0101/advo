package dev.rodolfo.advo.processo.application.port.in;

import dev.rodolfo.advo.processo.application.dto.ProcessoResponse;
public interface BuscarProcessoUseCase {

    ProcessoResponse execute(Long input);
}
