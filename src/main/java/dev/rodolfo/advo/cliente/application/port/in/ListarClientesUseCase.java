package dev.rodolfo.advo.cliente.application.port.in;

import dev.rodolfo.advo.cliente.application.dto.ClienteResponse;
import java.util.List;

public interface ListarClientesUseCase {

    List<ClienteResponse> execute(Void input);
}
