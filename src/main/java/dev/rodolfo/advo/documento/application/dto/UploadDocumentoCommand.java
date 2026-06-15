package dev.rodolfo.advo.documento.application.dto;

public record UploadDocumentoCommand(
        String nomeOriginal,
        byte[] conteudo,
        String tipoMime,
        Long processoId,
        Long usuarioId
) {
}
