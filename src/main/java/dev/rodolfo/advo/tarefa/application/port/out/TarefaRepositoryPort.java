package dev.rodolfo.advo.tarefa.application.port.out;

import dev.rodolfo.advo.tarefa.domain.model.Tarefa;
import java.util.List;
import java.util.Optional;

public interface TarefaRepositoryPort {
    Tarefa salvar(Tarefa tarefa);
    Optional<Tarefa> buscarPorId(Long id);
    List<Tarefa> listarPorResponsavel(Long responsavelId);
    List<Tarefa> listarPorProcesso(Long processoId);
}
