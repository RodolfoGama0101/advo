package dev.rodolfo.advo.tarefa.application.service;

import dev.rodolfo.advo.tarefa.application.dto.AtualizarStatusTarefaCommand;
import dev.rodolfo.advo.tarefa.application.dto.CriarTarefaCommand;
import dev.rodolfo.advo.tarefa.application.dto.TarefaResponse;
import dev.rodolfo.advo.tarefa.application.port.in.AtualizarStatusTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.BuscarTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.CriarTarefaUseCase;
import dev.rodolfo.advo.tarefa.application.port.in.ListarTarefasUseCase;
import dev.rodolfo.advo.tarefa.application.port.out.TarefaRepositoryPort;
import dev.rodolfo.advo.tarefa.domain.exception.TarefaNaoEncontradaException;
import dev.rodolfo.advo.tarefa.domain.model.Tarefa;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TarefaApplicationService implements CriarTarefaUseCase, AtualizarStatusTarefaUseCase, BuscarTarefaUseCase, ListarTarefasUseCase {

    private final TarefaRepositoryPort tarefaRepository;

    public TarefaApplicationService(TarefaRepositoryPort tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    @Override
    @Transactional
    public TarefaResponse execute(CriarTarefaCommand input) {
        Tarefa tarefa = Tarefa.criarNova(
                input.titulo(),
                input.descricao(),
                input.prioridade(),
                input.dataVencimento(),
                input.responsavelId(),
                input.processoId()
        );

        Tarefa salva = tarefaRepository.salvar(tarefa);
        return mapToResponse(salva);
    }

    @Override
    @Transactional
    public Void execute(AtualizarStatusTarefaCommand input) {
        Tarefa tarefa = tarefaRepository.buscarPorId(input.id())
                .orElseThrow(() -> new TarefaNaoEncontradaException(input.id()));

        tarefa.alterarStatus(input.novoStatus());
        tarefaRepository.salvar(tarefa);
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public TarefaResponse execute(Long id) {
        Tarefa tarefa = tarefaRepository.buscarPorId(id)
                .orElseThrow(() -> new TarefaNaoEncontradaException(id));
        return mapToResponse(tarefa);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarefaResponse> execute(FiltroTarefa input) {
        List<Tarefa> tarefas;
        if (input.responsavelId() != null) {
            tarefas = tarefaRepository.listarPorResponsavel(input.responsavelId());
        } else if (input.processoId() != null) {
            tarefas = tarefaRepository.listarPorProcesso(input.processoId());
        } else {
            throw new IllegalArgumentException("É necessário informar o responsável ou o processo para listar tarefas.");
        }

        return tarefas.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private TarefaResponse mapToResponse(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId(),
                tarefa.getTitulo(),
                tarefa.getDescricao(),
                tarefa.getStatus(),
                tarefa.getPrioridade(),
                tarefa.getDataVencimento(),
                tarefa.getResponsavelId(),
                tarefa.getProcessoId(),
                tarefa.getCriadoEm()
        );
    }
}
