package dev.rodolfo.advo.auth.application.port.in;

import dev.rodolfo.advo.auth.application.dto.LoginCommand;
import dev.rodolfo.advo.auth.application.dto.LoginResult;
public interface LoginUseCase {

    LoginResult execute(LoginCommand input);
}
