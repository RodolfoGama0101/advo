package dev.rodolfo.advo.auth.application.port.in;

import dev.rodolfo.advo.auth.application.dto.RefreshTokenCommand;
import dev.rodolfo.advo.auth.application.dto.LoginResult;
public interface RefreshTokenUseCase {

    LoginResult execute(RefreshTokenCommand input);
}
