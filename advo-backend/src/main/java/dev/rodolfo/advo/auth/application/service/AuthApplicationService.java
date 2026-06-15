package dev.rodolfo.advo.auth.application.service;

import dev.rodolfo.advo.auth.application.dto.*;
import dev.rodolfo.advo.auth.application.port.in.AlterarSenhaUseCase;
import dev.rodolfo.advo.auth.application.port.in.LoginUseCase;
import dev.rodolfo.advo.auth.application.port.in.RefreshTokenUseCase;
import dev.rodolfo.advo.auth.application.port.in.RegistrarUsuarioUseCase;
import dev.rodolfo.advo.auth.application.port.out.PasswordEncoderPort;
import dev.rodolfo.advo.auth.application.port.out.TokenProviderPort;
import dev.rodolfo.advo.auth.application.port.out.UsuarioRepositoryPort;
import dev.rodolfo.advo.auth.domain.exception.CredenciaisInvalidasException;
import dev.rodolfo.advo.auth.domain.exception.UsuarioNaoEncontradoException;
import dev.rodolfo.advo.auth.domain.model.Email;
import dev.rodolfo.advo.auth.domain.model.Senha;
import dev.rodolfo.advo.auth.domain.model.Usuario;
import dev.rodolfo.advo.auth.domain.service.AutenticacaoService;
import dev.rodolfo.advo.shared.domain.DomainException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthApplicationService implements LoginUseCase, RegistrarUsuarioUseCase, RefreshTokenUseCase, AlterarSenhaUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final TokenProviderPort tokenProvider;
    private final PasswordEncoderPort passwordEncoder;
    private final AutenticacaoService autenticacaoService;

    public AuthApplicationService(UsuarioRepositoryPort usuarioRepository, TokenProviderPort tokenProvider, PasswordEncoderPort passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.autenticacaoService = new AutenticacaoService(usuarioRepository, passwordEncoder);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResult execute(LoginCommand input) {
        Email email = new Email(input.email());
        Usuario usuario = autenticacaoService.autenticar(email, input.senha());

        String accessToken = tokenProvider.gerarAccessToken(usuario);
        String refreshToken = tokenProvider.gerarRefreshToken(usuario);
        Long expiresIn = 86400000L; // 24h em ms (deve vir da config idealmente, simplificado aqui)

        return new LoginResult(accessToken, refreshToken, expiresIn);
    }

    @Override
    @Transactional
    public Void execute(RegistrarUsuarioCommand input) {
        Email email = new Email(input.email());
        if (usuarioRepository.existePorEmail(email)) {
            throw new DomainException("Já existe um usuário cadastrado com este e-mail.") {};
        }

        Senha senhaHash = Senha.carregarHash(passwordEncoder.encode(input.senha()));
        Usuario novoUsuario = Usuario.criarNovo(input.nome(), email, senhaHash, input.role());

        usuarioRepository.salvar(novoUsuario);
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResult execute(RefreshTokenCommand input) {
        if (!tokenProvider.isTokenValido(input.refreshToken())) {
            throw new CredenciaisInvalidasException();
        }

        String emailStr = tokenProvider.obterSubjectDoToken(input.refreshToken());
        Usuario usuario = usuarioRepository.buscarPorEmail(new Email(emailStr))
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!usuario.isAtivo()) {
            throw new CredenciaisInvalidasException();
        }

        String accessToken = tokenProvider.gerarAccessToken(usuario);
        String novoRefreshToken = tokenProvider.gerarRefreshToken(usuario);
        Long expiresIn = 86400000L; 

        return new LoginResult(accessToken, novoRefreshToken, expiresIn);
    }

    @Override
    @Transactional
    public Void execute(AlterarSenhaCommand input) {
        Email email = new Email(input.email());
        Usuario usuario = usuarioRepository.buscarPorEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado."));

        if (!passwordEncoder.matches(input.senhaAtual(), usuario.getSenha().getValor())) {
            throw new CredenciaisInvalidasException();
        }

        Senha novaSenhaHash = Senha.carregarHash(passwordEncoder.encode(input.novaSenha()));
        usuario.alterarSenha(novaSenhaHash);

        usuarioRepository.salvar(usuario);
        return null;
    }
}
