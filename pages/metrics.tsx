import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

//página que garante acessibilidade apenas se o usuaário tiver permissão
export default function metrics() {
  return(
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  return {
    props: {},
  }
}, {
  permissions: ["metrics.list.pop"],
  roles: ["administrator"]
});