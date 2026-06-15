package dev.rodolfo.advo.tarefa.infrastructure.adapter.in.web;

import dev.rodolfo.advo.tarefa.application.dto.AtualizarStatusTarefaCommand;
import dev.rodolfo.advo.tarefa.application.dto.CriarTarefaCommand;
import dev.rodolfo.advo.tarefa.application.dto.TarefaResponse;
import dev.rodolfo.advo.tarefa.application.port.in.AtualizarStatusTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.BuscarTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.CriarTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.ListarTarefasUseCase;
import dev.rodolfo.advo.tarefa.domain.model.StatusTarefa;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final CriarTarefaUseCase criarTarefaUseCase;
    private final AtualizarStatusTarefaUseCase atualizarStatusTarefaUseCase;
    private final BuscarTarefaUseCase buscarTarefaUseCase;
    private final ListarTarefasUseCase listarTarefasUseCase;

    public TarefaController(CriarTarefaUseCase criarTarefaUseCase, AtualizarStatusTarefaUseCase atualizarStatusTarefaUseCase, BuscarTarefaUseCase buscarTarefaUseCase, ListarTarefasUseCase listarTarefasUseCase) {
        this.criarTarefaUseCase = criarTarefaUseCase;
        this.atualizarStatusTarefaUseCase = atualizarStatusTarefaUseCase;
        this.buscarTarefaUseCase = buscarTarefaUseCase;
        this.listarTarefasUseCase = listarTarefasUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<TarefaResponse> criar(@Valid @RequestBody CriarTarefaCommand command) {
        TarefaResponse response = criarTarefaUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestParam StatusTarefa novoStatus) {
        atualizarStatusTarefaUseCase.execute(new AtualizarStatusTarefaCommand(id, novoStatus));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<TarefaResponse> buscar(@PathVariable Long id) {
        TarefaResponse response = buscarTarefaUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<List<TarefaResponse>> listar(
            @RequestParam(required = false) Long responsavelId,
            @RequestParam(required = false) Long processoId) {
        
        List<TarefaResponse> response = listarTarefasUseCase.execute(
                new ListarTarefasUseCase.FiltroTarefa(responsavelId, processoId)
        );
        return ResponseEntity.ok(response);
    }
}
