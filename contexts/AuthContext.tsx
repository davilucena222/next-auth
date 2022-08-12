import {createContext, ReactNode, useEffect, useState} from "react";
import Router from "next/router";
import {setCookie, parseCookies} from "nookies";
import {api} from "../services/api";
import { AxiosRequestConfig, AxiosRequestHeaders, HeadersDefaults } from "axios";

// interface SmartAxiosDefaults<D = any> extends Omit<AxiosRequestConfig<D>, 'headers'> {
//   headers: HeadersDefaults & AxiosRequestHeaders;
// }

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user?: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

//valor inicial do contexto
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const {'nextAuth.token': token} = parseCookies();

    if (token) {
      api.get("/me").then(response => {
        const {email, permissions, roles} = response.data;

        setUser({
          email, 
          permissions, 
          roles,
        });
      })
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password
      });

      const {token, refreshToken, permissions, roles} = response.data;

      setCookie(undefined, "nextAuth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setCookie(undefined, "nextAuth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // const apiDefaults = api.defaults as SmartAxiosDefaults;
      // apiDefaults.headers.common['Authorization'] = `Bearer ${token}`;
      Router.push('/dashboard');

    } catch(error) {
      console.log(error);
    }

    console.log(user);
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}