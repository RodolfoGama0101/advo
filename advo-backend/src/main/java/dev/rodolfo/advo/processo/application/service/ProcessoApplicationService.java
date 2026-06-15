package dev.rodolfo.advo.processo.application.service;

import dev.rodolfo.advo.processo.application.dto.CriarProcessoCommand;
import dev.rodolfo.advo.processo.application.dto.MovimentacaoCommand;
import dev.rodolfo.advo.processo.application.dto.ProcessoResponse;
import dev.rodolfo.advo.processo.application.port.in.AdicionarMovimentacaoUseCase;
import dev.rodolfo.advo.processo.application.port.in.BuscarProcessoUseCase;
import dev.rodolfo.advo.processo.application.port.in.CriarProcessoUseCase;
import dev.rodolfo.advo.processo.application.port.in.ListarProcessosUseCase;
import dev.rodolfo.advo.processo.application.port.out.MovimentacaoRepositoryPort;
import dev.rodolfo.advo.processo.application.port.out.ProcessoRepositoryPort;
import dev.rodolfo.advo.processo.domain.exception.ProcessoNaoEncontradoException;
import dev.rodolfo.advo.processo.domain.model.Movimentacao;
import dev.rodolfo.advo.processo.domain.model.NumeroProcesso;
import dev.rodolfo.advo.processo.domain.model.ParteContraria;
import dev.rodolfo.advo.processo.domain.model.Processo;
import dev.rodolfo.advo.shared.domain.DomainException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessoApplicationService implements CriarProcessoUseCase, BuscarProcessoUseCase, ListarProcessosUseCase, AdicionarMovimentacaoUseCase {

    private final ProcessoRepositoryPort processoRepository;
    private final MovimentacaoRepositoryPort movimentacaoRepository;

    public ProcessoApplicationService(ProcessoRepositoryPort processoRepository, MovimentacaoRepositoryPort movimentacaoRepository) {
        this.processoRepository = processoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    @Override
    @Transactional
    public ProcessoResponse execute(CriarProcessoCommand input) {
        if (input.numeroProcesso() != null && !input.numeroProcesso().isBlank()) {
            if (processoRepository.existePorNumero(input.numeroProcesso())) {
                throw new DomainException("Já existe um processo com este número.") {};
            }
        }

        NumeroProcesso numeroProcesso = new NumeroProcesso(input.numeroProcesso());
        
        List<ParteContraria> partes = input.partesContrarias() != null ? input.partesContrarias().stream()
                .map(p -> new ParteContraria(null, p.nome(), p.cpfCnpj(), p.tipoParte(), p.advogadoContrario(), p.oabAdvogadoContrario()))
                .collect(Collectors.toList()) : null;

        Processo processo = Processo.criarNovo(
                numeroProcesso,
                input.titulo(),
                input.tribunal(),
                input.vara(),
                input.descricao(),
                input.clienteId(),
                input.areaDireitoId(),
                input.dataDistribuicao(),
                input.valorCausa(),
                partes,
                input.advogadosResponsaveisIds()
        );

        Processo salvo = processoRepository.salvar(processo);
        return mapToResponse(salvo);
    }

    @Override
    @Transactional(readOnly = true)
    public ProcessoResponse execute(Long id) {
        Processo processo = processoRepository.buscarPorId(id)
                .orElseThrow(() -> new ProcessoNaoEncontradoException(id));
        return mapToResponse(processo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProcessoResponse> execute(Void input) {
        return processoRepository.listarTodos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Void execute(MovimentacaoCommand input) {
        Processo processo = processoRepository.buscarPorId(input.processoId())
                .orElseThrow(() -> new ProcessoNaoEncontradoException(input.processoId()));

        Movimentacao movimentacao = Movimentacao.criarNova(
                input.titulo(),
                input.descricao(),
                input.dataMovimentacao(),
                input.usuarioId()
        );

        Movimentacao salva = movimentacaoRepository.salvar(movimentacao);
        processo.adicionarMovimentacao(salva);
        processoRepository.salvar(processo);

        return null;
    }

    private ProcessoResponse mapToResponse(Processo processo) {
        return new ProcessoResponse(
                processo.getId(),
                processo.getNumeroProcesso() != null ? processo.getNumeroProcesso().getValor() : null,
                processo.getTitulo(),
                processo.getTribunal(),
                processo.getVara(),
                processo.getFaseProcessual(),
                processo.getStatus(),
                processo.getDescricao(),
                processo.getClienteId(),
                processo.getAreaDireitoId(),
                processo.getDataDistribuicao(),
                processo.getValorCausa(),
                processo.getAdvogadosResponsaveisIds(),
                processo.getCriadoEm()
        );
    }
}
