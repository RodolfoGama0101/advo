package dev.rodolfo.advo.documento.infrastructure.adapter.in.web;

import dev.rodolfo.advo.documento.application.dto.DocumentoArquivoDTO;
import dev.rodolfo.advo.documento.application.dto.DocumentoResponse;
import dev.rodolfo.advo.documento.application.dto.UploadDocumentoCommand;
import dev.rodolfo.advo.documento.application.port.in.BaixarDocumentoUseCase;
import dev.rodolfo.advo.documento.application.port.in.ListarDocumentosProcessoUseCase;
import dev.rodolfo.advo.documento.application.port.in.UploadDocumentoUseCase;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final UploadDocumentoUseCase uploadDocumentoUseCase;
    private final BaixarDocumentoUseCase baixarDocumentoUseCase;
    private final ListarDocumentosProcessoUseCase listarDocumentosProcessoUseCase;

    public DocumentoController(UploadDocumentoUseCase uploadDocumentoUseCase, BaixarDocumentoUseCase baixarDocumentoUseCase, ListarDocumentosProcessoUseCase listarDocumentosProcessoUseCase) {
        this.uploadDocumentoUseCase = uploadDocumentoUseCase;
        this.baixarDocumentoUseCase = baixarDocumentoUseCase;
        this.listarDocumentosProcessoUseCase = listarDocumentosProcessoUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<DocumentoResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Long processoId,
            @RequestParam Long usuarioId) {

        try {
            UploadDocumentoCommand command = new UploadDocumentoCommand(
                    file.getOriginalFilename(),
                    file.getBytes(),
                    file.getContentType(),
                    processoId,
                    usuarioId
            );

            DocumentoResponse response = uploadDocumentoUseCase.execute(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        DocumentoArquivoDTO dto = baixarDocumentoUseCase.execute(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dto.nomeOriginal() + "\"")
                .contentType(MediaType.parseMediaType(dto.tipoMime() != null ? dto.tipoMime() : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(dto.conteudo());
    }

    @GetMapping("/processo/{processoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA')")
    public ResponseEntity<List<DocumentoResponse>> listarPorProcesso(@PathVariable Long processoId) {
        List<DocumentoResponse> response = listarDocumentosProcessoUseCase.execute(
                new ListarDocumentosProcessoUseCase.FiltroDocumentos(processoId)
        );
        return ResponseEntity.ok(response);
    }
}
