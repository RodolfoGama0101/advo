package dev.rodolfo.advo.agenda.application.port.in;

import dev.rodolfo.advo.agenda.application.dto.CriarCompromissoCommand;
import dev.rodolfo.advo.agenda.application.dto.CompromissoResponse;
public interface CriarCompromissoUseCase {

    CompromissoResponse execute(CriarCompromissoCommand input);
}
