package dev.rodolfo.advo.processo.infrastructure.adapter.in.web;

import dev.rodolfo.advo.processo.application.dto.CriarProcessoCommand;
import dev.rodolfo.advo.processo.application.dto.MovimentacaoCommand;
import dev.rodolfo.advo.processo.application.dto.ProcessoResponse;
import dev.rodolfo.advo.processo.application.port.in.AdicionarMovimentacaoUseCase;
import dev.rodolfo.advo.processo.application.port.in.BuscarProcessoUseCase;
import dev.rodolfo.advo.processo.application.port.in.CriarProcessoUseCase;
import dev.rodolfo.advo.processo.application.port.in.ListarProcessosUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processos")
public class ProcessoController {

    private final CriarProcessoUseCase criarProcessoUseCase;
    private final BuscarProcessoUseCase buscarProcessoUseCase;
    private final ListarProcessosUseCase listarProcessosUseCase;
    private final AdicionarMovimentacaoUseCase adicionarMovimentacaoUseCase;

    public ProcessoController(CriarProcessoUseCase criarProcessoUseCase, BuscarProcessoUseCase buscarProcessoUseCase, ListarProcessosUseCase listarProcessosUseCase, AdicionarMovimentacaoUseCase adicionarMovimentacaoUseCase) {
        this.criarProcessoUseCase = criarProcessoUseCase;
        this.buscarProcessoUseCase = buscarProcessoUseCase;
        this.listarProcessosUseCase = listarProcessosUseCase;
        this.adicionarMovimentacaoUseCase = adicionarMovimentacaoUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO')")
    public ResponseEntity<ProcessoResponse> criar(@Valid @RequestBody CriarProcessoCommand command) {
        ProcessoResponse response = criarProcessoUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA', 'ESTAGIARIO')")
    public ResponseEntity<ProcessoResponse> buscar(@PathVariable Long id) {
        ProcessoResponse response = buscarProcessoUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA', 'ESTAGIARIO')")
    public ResponseEntity<List<ProcessoResponse>> listar() {
        List<ProcessoResponse> response = listarProcessosUseCase.execute(null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/movimentacoes")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO')")
    public ResponseEntity<Void> adicionarMovimentacao(@PathVariable Long id, @Valid @RequestBody MovimentacaoCommand command) {
        if (!id.equals(command.processoId())) {
            return ResponseEntity.badRequest().build();
        }
        adicionarMovimentacaoUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
