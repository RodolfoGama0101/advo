package dev.rodolfo.advo.documento.application.dto;

public record DocumentoArquivoDTO(
        String nomeOriginal,
        String tipoMime,
        byte[] conteudo
) {
}
