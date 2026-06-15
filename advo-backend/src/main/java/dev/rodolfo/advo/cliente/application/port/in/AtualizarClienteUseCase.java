package dev.rodolfo.advo.cliente.application.port.in;

import dev.rodolfo.advo.cliente.application.dto.AtualizarClienteCommand;
import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
public interface AtualizarClienteUseCase {

    ClienteResponse execute(AtualizarClienteCommand input);
}
