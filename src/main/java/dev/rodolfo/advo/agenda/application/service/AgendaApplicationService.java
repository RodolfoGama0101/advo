package dev.rodolfo.advo.agenda.application.service;

import dev.rodolfo.advo.agenda.application.dto.CompromissoResponse;
import dev.rodolfo.advo.agenda.application.dto.CriarCompromissoCommand;
import dev.rodolfo.advo.agenda.application.port.in.BuscarCompromissoUseCase;
import dev.rodolfo.advo.agenda.application.port.in.CriarCompromissoUseCase;
import dev.rodolfo.advo.agenda.application.port.in.ListarCompromissosUseCase;
import dev.rodolfo.advo.agenda.application.port.out.AgendaRepositoryPort;
import dev.rodolfo.advo.agenda.domain.exception.CompromissoNaoEncontradoException;
import dev.rodolfo.advo.agenda.domain.model.Compromisso;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendaApplicationService implements CriarCompromissoUseCase, BuscarCompromissoUseCase, ListarCompromissosUseCase {

    private final AgendaRepositoryPort agendaRepository;

    public AgendaApplicationService(AgendaRepositoryPort agendaRepository) {
        this.agendaRepository = agendaRepository;
    }

    @Override
    @Transactional
    public CompromissoResponse execute(CriarCompromissoCommand input) {
        Compromisso compromisso = Compromisso.criarNovo(
                input.titulo(),
                input.descricao(),
                input.dataHoraInicio(),
                input.dataHoraFim(),
                input.localCompromisso(),
                input.usuarioId(),
                input.processoId(),
                input.clienteId()
        );

        Compromisso salvo = agendaRepository.salvar(compromisso);
        return mapToResponse(salvo);
    }

    @Override
    @Transactional(readOnly = true)
    public CompromissoResponse execute(Long id) {
        Compromisso compromisso = agendaRepository.buscarPorId(id)
                .orElseThrow(() -> new CompromissoNaoEncontradoException(id));
        return mapToResponse(compromisso);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompromissoResponse> execute(FiltroPeriodo input) {
        List<Compromisso> compromissos = agendaRepository.listarPorUsuarioEPeriodo(
                input.usuarioId(), input.inicio(), input.fim()
        );
        return compromissos.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private CompromissoResponse mapToResponse(Compromisso compromisso) {
        return new CompromissoResponse(
                compromisso.getId(),
                compromisso.getTitulo(),
                compromisso.getDescricao(),
                compromisso.getDataHoraInicio(),
                compromisso.getDataHoraFim(),
                compromisso.getLocalCompromisso(),
                compromisso.getUsuarioId(),
                compromisso.getProcessoId(),
                compromisso.getClienteId(),
                compromisso.getCriadoEm()
        );
    }
}
