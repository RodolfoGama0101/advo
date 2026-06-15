package dev.rodolfo.advo.auth.application.port.in;

import dev.rodolfo.advo.auth.application.dto.RegistrarUsuarioCommand;
public interface RegistrarUsuarioUseCase {

    Void execute(RegistrarUsuarioCommand input);
}
