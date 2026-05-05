import "./Home.css";
import { useEffect } from "react";
import AdminReturnButton from "./AdminReturnButton";
function Home({ page }) {
  useEffect(() => {
    page("home");
  }, [page]);
  return (
    <>
      <title>Home</title>
      <h1>Home</h1>
      <AdminReturnButton />
    </>
  );
}
export default Home;
