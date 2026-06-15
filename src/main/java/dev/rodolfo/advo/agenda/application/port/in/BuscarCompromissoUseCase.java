package dev.rodolfo.advo.agenda.application.port.in;

import dev.rodolfo.advo.agenda.application.dto.CompromissoResponse;
public interface BuscarCompromissoUseCase {

    CompromissoResponse execute(Long input);
}
