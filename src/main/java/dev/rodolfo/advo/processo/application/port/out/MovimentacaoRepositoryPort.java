package dev.rodolfo.advo.processo.application.port.out;

import dev.rodolfo.advo.processo.domain.model.Movimentacao;

public interface MovimentacaoRepositoryPort {
    Movimentacao salvar(Movimentacao movimentacao);
}
