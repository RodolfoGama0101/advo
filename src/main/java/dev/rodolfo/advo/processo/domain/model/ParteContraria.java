package dev.rodolfo.advo.processo.domain.model;

import dev.rodolfo.advo.shared.domain.Entity;

public class ParteContraria extends Entity<Long> {
    
    private String nome;
    private String cpfCnpj;
    private String tipoParte;
    private String advogadoContrario;
    private String oabAdvogadoContrario;

    public ParteContraria(Long id, String nome, String cpfCnpj, String tipoParte, String advogadoContrario, String oabAdvogadoContrario) {
        this.id = id;
        this.nome = nome;
        this.cpfCnpj = cpfCnpj;
        this.tipoParte = tipoParte;
        this.advogadoContrario = advogadoContrario;
        this.oabAdvogadoContrario = oabAdvogadoContrario;
    }

    public String getNome() { return nome; }
    public String getCpfCnpj() { return cpfCnpj; }
    public String getTipoParte() { return tipoParte; }
    public String getAdvogadoContrario() { return advogadoContrario; }
    public String getOabAdvogadoContrario() { return oabAdvogadoContrario; }
}
