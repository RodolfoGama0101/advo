package dev.rodolfo.advo.tarefa.application.port.in;
import dev.rodolfo.advo.tarefa.application.dto.AtualizarStatusTarefaCommand;

public interface AtualizarStatusTarefaUseCase {

    Void execute(AtualizarStatusTarefaCommand input);
}
