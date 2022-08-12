import { AuthProvider } from "../contexts/AuthContext";
import { AppProps } from "../node_modules/next/dist/shared/lib/router/router";
import "../styles/global.css";
import "./home.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp