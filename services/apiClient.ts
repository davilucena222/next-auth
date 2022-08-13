import { setupAPIClient } from "./api";

//chamando a api do lado do cliente sem passar o contexto
export const api = setupAPIClient();

//quando for chamar a api do lado do servidor basta chamar setupAPIClient(ctx) passando o contexto da requisição feita pelo lado do client