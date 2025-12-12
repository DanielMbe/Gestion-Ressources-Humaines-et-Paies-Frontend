import "/src/main.css"
import { Login } from "/src/pages/Login"
import { Application } from "/src/pages/Application"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

export default function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gestion-rh" element={<Application />} />
      </Routes>
    </Router>
  );
}