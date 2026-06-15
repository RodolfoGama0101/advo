package dev.rodolfo.advo.cliente.infrastructure.adapter.in.web;

import dev.rodolfo.advo.cliente.application.dto.AtualizarClienteCommand;
import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
import dev.rodolfo.advo.cliente.application.dto.CriarClienteCommand;
import dev.rodolfo.advo.cliente.application.port.in.AtualizarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.BuscarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.CriarClienteUseCase;
import dev.rodolfo.advo.cliente.application.port.in.ListarClientesUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final CriarClienteUseCase criarClienteUseCase;
    private final AtualizarClienteUseCase atualizarClienteUseCase;
    private final BuscarClienteUseCase buscarClienteUseCase;
    private final ListarClientesUseCase listarClientesUseCase;

    public ClienteController(CriarClienteUseCase criarClienteUseCase, AtualizarClienteUseCase atualizarClienteUseCase, BuscarClienteUseCase buscarClienteUseCase, ListarClientesUseCase listarClientesUseCase) {
        this.criarClienteUseCase = criarClienteUseCase;
        this.atualizarClienteUseCase = atualizarClienteUseCase;
        this.buscarClienteUseCase = buscarClienteUseCase;
        this.listarClientesUseCase = listarClientesUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA')")
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody CriarClienteCommand command) {
        ClienteResponse response = criarClienteUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA')")
    public ResponseEntity<ClienteResponse> atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarClienteCommand command) {
        if (!id.equals(command.id())) {
            return ResponseEntity.badRequest().build();
        }
        ClienteResponse response = atualizarClienteUseCase.execute(command);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA', 'ESTAGIARIO')")
    public ResponseEntity<ClienteResponse> buscar(@PathVariable Long id) {
        ClienteResponse response = buscarClienteUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'SECRETARIA', 'ESTAGIARIO')")
    public ResponseEntity<List<ClienteResponse>> listar() {
        List<ClienteResponse> response = listarClientesUseCase.execute(null);
        return ResponseEntity.ok(response);
    }
}
