package dev.rodolfo.advo.shared.application;

/**
 * Interface base para casos de uso (Use Cases) da aplicação.
 * @param <I> Tipo de entrada (Command/Request)
 * @param <O> Tipo de saída (Response/Result)
 */
public interface UseCase<I, O> {

    O execute(I input);
}
