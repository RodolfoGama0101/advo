package dev.rodolfo.advo.tarefa.application.port.in;
import dev.rodolfo.advo.tarefa.application.dto.TarefaResponse;

public interface BuscarTarefaUseCase {

    TarefaResponse execute(Long input);
}
