package dev.rodolfo.advo.financeiro.application.port.in;

import dev.rodolfo.advo.financeiro.application.dto.TransacaoResponse;
import java.util.List;

public interface ListarTransacoesUseCase {

    List<TransacaoResponse> execute(ListarTransacoesUseCase.FiltroTransacao input);

    record FiltroTransacao(Long processoId, Long clienteId) {}
}
