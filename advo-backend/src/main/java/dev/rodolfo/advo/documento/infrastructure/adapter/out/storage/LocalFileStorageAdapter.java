package dev.rodolfo.advo.documento.infrastructure.adapter.out.storage;

import dev.rodolfo.advo.documento.application.port.out.FileStoragePort;
import dev.rodolfo.advo.shared.domain.DomainException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalFileStorageAdapter implements FileStoragePort {

    private final Path rootPath;

    public LocalFileStorageAdapter(@Value("${advo.storage.local.dir:./storage/documentos}") String storageDir) {
        this.rootPath = Paths.get(storageDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootPath);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório de storage", e);
        }
    }

    @Override
    public String salvarArquivo(String nomeOriginal, byte[] conteudo) {
        try {
            String extensao = "";
            int lastDot = nomeOriginal.lastIndexOf('.');
            if (lastDot > 0) {
                extensao = nomeOriginal.substring(lastDot);
            }
            
            String novoNomeArquivo = UUID.randomUUID().toString() + extensao;
            Path caminhoDestino = this.rootPath.resolve(novoNomeArquivo);
            
            Files.write(caminhoDestino, conteudo);
            
            return novoNomeArquivo; // Retorna apenas o nome gerado para salvar no DB como caminho relativo
        } catch (IOException e) {
            throw new DomainException("Erro ao armazenar arquivo fisicamente: " + e.getMessage()) {};
        }
    }

    @Override
    public byte[] recuperarArquivo(String caminhoRelativo) {
        try {
            Path arquivoPath = this.rootPath.resolve(caminhoRelativo).normalize();
            
            if (!arquivoPath.startsWith(this.rootPath)) {
                throw new DomainException("Acesso negado fora do diretório de storage.") {};
            }
            
            if (!Files.exists(arquivoPath)) {
                throw new DomainException("Arquivo físico não encontrado no storage.") {};
            }
            
            return Files.readAllBytes(arquivoPath);
        } catch (IOException e) {
            throw new DomainException("Erro ao ler arquivo físico: " + e.getMessage()) {};
        }
    }
}
