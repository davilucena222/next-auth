import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

export default function Home() {
  const {isAuthenticated, signIn} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email, 
      password
    }

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

//validação feita pelo servidor
//lado do back-end
//ao utilizar os cookies no lado do back-end (servidor) é preciso passar o contexto da requisição
export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  }
});