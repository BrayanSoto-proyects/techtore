// Página de inicio de sesión con validación y almacenamiento del JWT.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      await login(data.token);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-orb mb-3">T</div>
        <h2>Bienvenido a TechStore</h2>
        <p>Accede al panel administrativo para gestionar ventas, inventario y clientes.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <label className="form-label">Correo electrónico</label>
          <input className="form-control mb-3" type="email" placeholder="usuario@correo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label className="form-label">Contraseña</label>
          <input className="form-control mb-4" type="password" placeholder="Tu contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn btn-primary w-100">Entrar al sistema</button>
        </form>
        <p className="mt-4 mb-0">¿No tienes cuenta? <Link className="auth-link" to="/register">Crear cuenta</Link></p>
      </section>
    </main>
  );
}
