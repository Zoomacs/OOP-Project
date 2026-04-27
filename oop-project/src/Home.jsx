import { useEffect } from "react";
function Home({ page }) {
  useEffect(() => {
    page("home");
  }, [page]);
  return (
    <>
      <title>Home</title>
      <h1>Home</h1>
    </>
  );
}
export default Home;
