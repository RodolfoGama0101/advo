package dev.rodolfo.advo.auth.application.port.in;

import dev.rodolfo.advo.auth.application.dto.AlterarSenhaCommand;
public interface AlterarSenhaUseCase {

    Void execute(AlterarSenhaCommand input);
}
