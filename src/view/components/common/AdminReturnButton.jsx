import { useNavigate } from "react-router-dom";
import "./AdminReturnButton.css";

function AdminReturnButton() {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("adminLoggedIn") === "true";

  if (!isAdmin) return null;

  return (
    <button className="admin-return-button" onClick={() => navigate("/admin")}>
      Return to Admin
    </button>
  );
}

export default AdminReturnButton;
