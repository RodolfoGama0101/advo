package dev.rodolfo.advo.documento.application.port.out;

public interface FileStoragePort {
    String salvarArquivo(String nomeOriginal, byte[] conteudo);
    byte[] recuperarArquivo(String caminhoRelativo);
}
