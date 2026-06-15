package dev.rodolfo.advo.cliente.application.port.in;

import dev.rodolfo.advo.cliente.application.dto.CriarClienteCommand;
import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
public interface CriarClienteUseCase {

    ClienteResponse execute(CriarClienteCommand input);
}
