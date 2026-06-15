package dev.rodolfo.advo.financeiro.infrastructure.adapter.in.web;

import dev.rodolfo.advo.financeiro.application.dto.PagarTransacaoCommand;
import dev.rodolfo.advo.financeiro.application.dto.RegistrarTransacaoCommand;
import dev.rodolfo.advo.financeiro.application.dto.TransacaoResponse;
import dev.rodolfo.advo.financeiro.application.port.in.ListarTransacoesUseCase;
import dev.rodolfo.advo.financeiro.application.port.in.PagarTransacaoUseCase;
import dev.rodolfo.advo.financeiro.application.port.in.RegistrarTransacaoUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/financeiro")
public class FinanceiroController {

    private final RegistrarTransacaoUseCase registrarTransacaoUseCase;
    private final PagarTransacaoUseCase pagarTransacaoUseCase;
    private final ListarTransacoesUseCase listarTransacoesUseCase;

    public FinanceiroController(RegistrarTransacaoUseCase registrarTransacaoUseCase, PagarTransacaoUseCase pagarTransacaoUseCase, ListarTransacoesUseCase listarTransacoesUseCase) {
        this.registrarTransacaoUseCase = registrarTransacaoUseCase;
        this.pagarTransacaoUseCase = pagarTransacaoUseCase;
        this.listarTransacoesUseCase = listarTransacoesUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO')")
    public ResponseEntity<TransacaoResponse> registrar(@Valid @RequestBody RegistrarTransacaoCommand command) {
        TransacaoResponse response = registrarTransacaoUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/pagar")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO')")
    public ResponseEntity<Void> pagar(@PathVariable Long id, @RequestParam(required = false) LocalDate dataPagamento) {
        pagarTransacaoUseCase.execute(new PagarTransacaoCommand(id, dataPagamento));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO')")
    public ResponseEntity<List<TransacaoResponse>> listar(
            @RequestParam(required = false) Long processoId,
            @RequestParam(required = false) Long clienteId) {
        
        List<TransacaoResponse> response = listarTransacoesUseCase.execute(
                new ListarTransacoesUseCase.FiltroTransacao(processoId, clienteId)
        );
        return ResponseEntity.ok(response);
    }
}
