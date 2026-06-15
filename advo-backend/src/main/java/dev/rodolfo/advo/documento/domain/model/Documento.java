package dev.rodolfo.advo.documento.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

import java.time.LocalDateTime;

public class Documento extends Entity<Long> {

    private String nomeOriginal;
    private String caminhoArquivo;
    private Long tamanhoBytes;
    private String tipoMime;
    private Long processoId;
    private Long usuarioId;
    private LocalDateTime criadoEm;

    public Documento(Long id, String nomeOriginal, String caminhoArquivo, Long tamanhoBytes, String tipoMime, Long processoId, Long usuarioId, LocalDateTime criadoEm) {
        this.id = id;
        this.nomeOriginal = nomeOriginal;
        this.caminhoArquivo = caminhoArquivo;
        this.tamanhoBytes = tamanhoBytes;
        this.tipoMime = tipoMime;
        this.processoId = processoId;
        this.usuarioId = usuarioId;
        this.criadoEm = criadoEm;
    }

    public static Documento criarNovo(String nomeOriginal, String caminhoArquivo, Long tamanhoBytes, String tipoMime, Long processoId, Long usuarioId) {
        return new Documento(null, nomeOriginal, caminhoArquivo, tamanhoBytes, tipoMime, processoId, usuarioId, LocalDateTime.now());
    }

    public String getNomeOriginal() { return nomeOriginal; }
    public String getCaminhoArquivo() { return caminhoArquivo; }
    public Long getTamanhoBytes() { return tamanhoBytes; }
    public String getTipoMime() { return tipoMime; }
    public Long getProcessoId() { return processoId; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
