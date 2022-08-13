import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSGAuth";

export default function Dashboard() {
  const {user} = useContext(AuthContext);

  //quando o token expirado receber um novo token essa requisição não precisará mais ser executada, pois o token ainda estará válido e não como "token.expired"
  //essa requisição é executada logo após a que está embaixo, a requisição feita pelo servidor 
  useEffect(() => {
    api.get("/me").then(response => console.log(response)).catch((error) => console.log(error));
  }, []);

  return(
    <>
      <h1>Dashboard: {user?.email}</h1>

      <Can permissions={[""]}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

//validação feita pelo servidor 
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  }
});