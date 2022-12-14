import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

type AxiosErrorResponse = {
  code?: string;
}

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  api.defaults.headers.common['Authorization'] = `Bearer ${cookies["nextAuth.token"]}`;

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response.status === 401) { //erro de não autorizado
      if (error.response.data?.code === "token.expired") {
        cookies = parseCookies(ctx);

        const { 'nextAuth.refreshToken': refreshToken } = cookies;

        //originalConfig possui toda a configuração que foi feita para o back-end, ele detém todas as informações que são necessárias do back-end para repetir elas dentro do próprio back-end (requisições, acesso à rotas que foram chamadas, quais parâmetros foram enviados, qual era o callback...)
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          //atualizando o token (realizando refreshToken)
          api.post("/refresh", {
            refreshToken,
          }).then(response => {
            const { token } = response?.data;

            setCookie(ctx, "nextAuth.token", token, {
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });

            setCookie(ctx, "nextAuth.refreshToken", response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });

            //atualizando o token jwt que está sendo enviado nas requisições da API
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            //se a requisição do refreshToken tiver dado certo, vai até a lista de requisições falhadas, vai passar o token atualizado para que essas requisições sejam excutadas novamente, porém dessa vez com o novo token
            failedRequestsQueue.forEach(request => request.onSuccess(token));
            failedRequestsQueue = [];
          }).catch(error => {
            failedRequestsQueue.forEach(request => request.onFailure(error));
            failedRequestsQueue = [];

            if (typeof window !== "undefined") {//verificação para não executar no lado do servidor
              signOut(); //só executa no lado do Browser
            }
          }).finally(() => {
            isRefreshing = false;
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              //vai tentar novamente as requisições que deram erradas quando o token estava sendo atualizado, porém agora com o novo token
              //e dessa vez atualizando também os headers para realizar as requisições com o noovo token
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              //passando toda a configuração do back-end para a api executar tudo, inclusive as requisicões que deram errado quando o token estava sendo atualizado novamente
              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            }
          });
        });
      } else {
        if (typeof window !== "undefined") {//verificação para não executar no lado do servidor
          signOut(); //só executa no lado do Browser
        } else {//erro sendo disparado pelo lado do servidor, retornando um objeto de erro
          return Promise.reject(new AuthTokenError());
        }
      }
    }

    return Promise.reject(error);
  });

  return api;
}