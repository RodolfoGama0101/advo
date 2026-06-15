package dev.rodolfo.advo.documento.application.service;

import dev.rodolfo.advo.documento.application.dto.DocumentoArquivoDTO;
import dev.rodolfo.advo.documento.application.dto.DocumentoResponse;
import dev.rodolfo.advo.documento.application.dto.UploadDocumentoCommand;
import dev.rodolfo.advo.documento.application.port.in.BaixarDocumentoUseCase;
import dev.rodolfo.advo.documento.application.port.in.ListarDocumentosProcessoUseCase;
import dev.rodolfo.advo.documento.application.port.in.UploadDocumentoUseCase;
import dev.rodolfo.advo.documento.application.port.out.DocumentoRepositoryPort;
import dev.rodolfo.advo.documento.application.port.out.FileStoragePort;
import dev.rodolfo.advo.documento.domain.exception.DocumentoNaoEncontradoException;
import dev.rodolfo.advo.documento.domain.model.Documento;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentoApplicationService implements UploadDocumentoUseCase, BaixarDocumentoUseCase, ListarDocumentosProcessoUseCase {

    private final DocumentoRepositoryPort documentoRepository;
    private final FileStoragePort fileStoragePort;

    public DocumentoApplicationService(DocumentoRepositoryPort documentoRepository, FileStoragePort fileStoragePort) {
        this.documentoRepository = documentoRepository;
        this.fileStoragePort = fileStoragePort;
    }

    @Override
    @Transactional
    public DocumentoResponse execute(UploadDocumentoCommand input) {
        String caminhoRelativo = fileStoragePort.salvarArquivo(input.nomeOriginal(), input.conteudo());
        Long tamanhoBytes = (long) input.conteudo().length;

        Documento documento = Documento.criarNovo(
                input.nomeOriginal(),
                caminhoRelativo,
                tamanhoBytes,
                input.tipoMime(),
                input.processoId(),
                input.usuarioId()
        );

        Documento salvo = documentoRepository.salvar(documento);
        return mapToResponse(salvo);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentoArquivoDTO execute(Long id) {
        Documento documento = documentoRepository.buscarPorId(id)
                .orElseThrow(() -> new DocumentoNaoEncontradoException(id));

        byte[] conteudo = fileStoragePort.recuperarArquivo(documento.getCaminhoArquivo());

        return new DocumentoArquivoDTO(
                documento.getNomeOriginal(),
                documento.getTipoMime(),
                conteudo
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoResponse> execute(ListarDocumentosProcessoUseCase.FiltroDocumentos input) {
        return documentoRepository.listarPorProcesso(input.processoId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DocumentoResponse mapToResponse(Documento documento) {
        return new DocumentoResponse(
                documento.getId(),
                documento.getNomeOriginal(),
                documento.getTamanhoBytes(),
                documento.getTipoMime(),
                documento.getProcessoId(),
                documento.getUsuarioId(),
                documento.getCriadoEm()
        );
    }
}
