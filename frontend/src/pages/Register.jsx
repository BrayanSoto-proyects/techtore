// Página de registro de usuario con validación básica en cliente.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [f, setF] = useState({ nombre: "", email: "", password: "", rol: "vendedor" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres");
    try {
      await api.post("/auth/register", f);
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al registrar");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-orb mb-3">+</div>
        <h2>Crear cuenta</h2>
        <p>Registra un usuario para acceder al ecosistema administrativo TechStore.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <label className="form-label">Nombre</label>
          <input className="form-control mb-3" placeholder="Nombre del usuario" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} required />
          <label className="form-label">Correo electrónico</label>
          <input className="form-control mb-3" type="email" placeholder="usuario@correo.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
          <label className="form-label">Contraseña</label>
          <input className="form-control mb-3" type="password" placeholder="Mínimo 6 caracteres" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
          <label className="form-label">Rol</label>
          <select className="form-select mb-4" value={f.rol} onChange={(e) => setF({ ...f, rol: e.target.value })}>
            <option>vendedor</option>
            <option>admin</option>
          </select>
          <button className="btn btn-primary w-100">Registrar usuario</button>
        </form>
        <p className="mt-4 mb-0">¿Ya tienes cuenta? <Link className="auth-link" to="/login">Iniciar sesión</Link></p>
      </section>
    </main>
  );
}
