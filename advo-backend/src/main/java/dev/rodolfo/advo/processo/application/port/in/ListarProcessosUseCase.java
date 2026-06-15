package dev.rodolfo.advo.processo.application.port.in;

import dev.rodolfo.advo.processo.application.dto.ProcessoResponse;
import java.util.List;

public interface ListarProcessosUseCase {

    List<ProcessoResponse> execute(Void input);
}
