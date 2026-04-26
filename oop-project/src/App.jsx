import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogIn } from "lucide-react";
import Login from "./login";
import Home from "./Home";
import Navbar from "./Navbar";
import "./main.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
