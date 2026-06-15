package dev.rodolfo.advo.cliente.application.port.in;

import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
public interface BuscarClienteUseCase {

    ClienteResponse execute(Long input);
}
