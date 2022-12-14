import {createContext, ReactNode, useEffect, useState} from "react";
import Router from "next/router";
import {setCookie, parseCookies, destroyCookie} from "nookies";
import { api } from "../services/apiClient";

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
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user?: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

//valor inicial do contexto
export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel; 

export function signOut() {
  destroyCookie(undefined, "nextAuth.token");
  destroyCookie(undefined, "nextAuth.refreshToken");

  authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch(message.data) {
        case "signOut":
          Router.push('/');
          break;
        case "signIn":
          Router.push('/dashboard');
          break;
        default:
          break;
      }
    }
  }, []);

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
      }).catch(() => {
        signOut();
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

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");

      authChannel.postMessage("signIn");
    } catch(error) {
      console.log(error);
    }

    console.log(user);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}