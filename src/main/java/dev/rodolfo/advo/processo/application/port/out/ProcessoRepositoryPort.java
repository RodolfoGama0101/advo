package dev.rodolfo.advo.processo.application.port.out;

import dev.rodolfo.advo.processo.domain.model.Processo;

import java.util.List;
import java.util.Optional;

public interface ProcessoRepositoryPort {
    Processo salvar(Processo processo);
    Optional<Processo> buscarPorId(Long id);
    List<Processo> listarTodos();
    boolean existePorNumero(String numeroProcesso);
}
