package dev.rodolfo.advo.agenda.application.port.out;

import dev.rodolfo.advo.agenda.domain.model.Compromisso;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AgendaRepositoryPort {
    Compromisso salvar(Compromisso compromisso);
    Optional<Compromisso> buscarPorId(Long id);
    List<Compromisso> listarPorUsuarioEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim);
}
