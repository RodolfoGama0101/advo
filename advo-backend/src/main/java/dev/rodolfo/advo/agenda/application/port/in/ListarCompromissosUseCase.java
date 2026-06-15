package dev.rodolfo.advo.agenda.application.port.in;

import dev.rodolfo.advo.agenda.application.dto.CompromissoResponse;
import java.time.LocalDateTime;
import java.util.List;

public interface ListarCompromissosUseCase {

    List<CompromissoResponse> execute(ListarCompromissosUseCase.FiltroPeriodo input);
    
    record FiltroPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {}
}
