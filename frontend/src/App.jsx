// Componente principal: define rutas públicas y privadas de TechStore.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Clientes from "./pages/Clientes";
import NuevaVenta from "./pages/NuevaVenta";
import HistorialVentas from "./pages/HistorialVentas";
import Reportes from "./pages/Reportes";

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container-fluid app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas/nueva" element={<NuevaVenta />} />
          <Route path="/ventas" element={<HistorialVentas />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
