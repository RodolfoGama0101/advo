package dev.rodolfo.advo.tarefa.application.port.in;
import dev.rodolfo.advo.tarefa.application.dto.TarefaResponse;
import java.util.List;

public interface ListarTarefasUseCase {

    List<TarefaResponse> execute(ListarTarefasUseCase.FiltroTarefa input);

    record FiltroTarefa(Long responsavelId, Long processoId) {}
}
