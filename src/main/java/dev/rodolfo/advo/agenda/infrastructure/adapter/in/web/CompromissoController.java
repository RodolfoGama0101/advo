package dev.rodolfo.advo.agenda.infrastructure.adapter.in.web;

import dev.rodolfo.advo.agenda.application.dto.CompromissoResponse;
import dev.rodolfo.advo.agenda.application.dto.CriarCompromissoCommand;
import dev.rodolfo.advo.agenda.application.port.in.BuscarCompromissoUseCase;
import dev.rodolfo.advo.agenda.application.port.in.CriarCompromissoUseCase;
import dev.rodolfo.advo.agenda.application.port.in.ListarCompromissosUseCase;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/agenda")
public class CompromissoController {

    private final CriarCompromissoUseCase criarCompromissoUseCase;
    private final BuscarCompromissoUseCase buscarCompromissoUseCase;
    private final ListarCompromissosUseCase listarCompromissosUseCase;

    public CompromissoController(CriarCompromissoUseCase criarCompromissoUseCase, BuscarCompromissoUseCase buscarCompromissoUseCase, ListarCompromissosUseCase listarCompromissosUseCase) {
        this.criarCompromissoUseCase = criarCompromissoUseCase;
        this.buscarCompromissoUseCase = buscarCompromissoUseCase;
        this.listarCompromissosUseCase = listarCompromissosUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO')")
    public ResponseEntity<CompromissoResponse> criar(@Valid @RequestBody CriarCompromissoCommand command) {
        CompromissoResponse response = criarCompromissoUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO')")
    public ResponseEntity<CompromissoResponse> buscar(@PathVariable Long id) {
        CompromissoResponse response = buscarCompromissoUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO')")
    public ResponseEntity<List<CompromissoResponse>> listar(
            @RequestParam Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        
        List<CompromissoResponse> response = listarCompromissosUseCase.execute(
                new ListarCompromissosUseCase.FiltroPeriodo(usuarioId, inicio, fim)
        );
        return ResponseEntity.ok(response);
    }
}
