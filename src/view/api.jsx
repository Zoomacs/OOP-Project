import "./api.css";
export { api, API_BASE } from "../controller/ApiController";
export function getUser() {
  const raw = sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
