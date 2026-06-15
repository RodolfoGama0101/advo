package dev.rodolfo.advo.tarefa.application.port.in;
import dev.rodolfo.advo.tarefa.application.dto.CriarTarefaCommand;
import dev.rodolfo.advo.tarefa.application.dto.TarefaResponse;

public interface CriarTarefaUseCase {

    TarefaResponse execute(CriarTarefaCommand input);
}
