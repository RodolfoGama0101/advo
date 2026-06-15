package dev.rodolfo.advo.auth.infrastructure.adapter.in.web;

import dev.rodolfo.advo.auth.application.dto.*;
import dev.rodolfo.advo.auth.application.port.in.AlterarSenhaUseCase;
import dev.rodolfo.advo.auth.application.port.in.LoginUseCase;
import dev.rodolfo.advo.auth.application.port.in.RefreshTokenUseCase;
import dev.rodolfo.advo.auth.application.port.in.RegistrarUsuarioUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final AlterarSenhaUseCase alterarSenhaUseCase;

    public AuthController(LoginUseCase loginUseCase,
                          RegistrarUsuarioUseCase registrarUsuarioUseCase,
                          RefreshTokenUseCase refreshTokenUseCase,
                          AlterarSenhaUseCase alterarSenhaUseCase) {
        this.loginUseCase = loginUseCase;
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.alterarSenhaUseCase = alterarSenhaUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResult> login(@Valid @RequestBody LoginCommand command) {
        LoginResult result = loginUseCase.execute(command);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResult> refresh(@Valid @RequestBody RefreshTokenCommand command) {
        LoginResult result = refreshTokenUseCase.execute(command);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/registro")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> registrarUsuario(@Valid @RequestBody RegistrarUsuarioCommand command) {
        registrarUsuarioUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/senha")
    public ResponseEntity<Void> alterarSenha(@Valid @RequestBody AlterarSenhaCommand command) {
        alterarSenhaUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }
}
