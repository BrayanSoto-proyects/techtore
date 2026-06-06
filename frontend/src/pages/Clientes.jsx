// Gestión de clientes: búsqueda, creación y edición.
import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = { nombre: "", email: "", telefono: "", rfc: "" };

export default function Clientes() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [f, setF] = useState(initialForm);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    const { data } = await api.get(`/clientes?q=${encodeURIComponent(q)}`);
    setItems(data || []);
  };

  useEffect(() => { cargar(); }, [q]);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      setError("");
      edit ? await api.put(`/clientes/${edit}`, f) : await api.post("/clientes", f);
      setF(initialForm);
      setEdit(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar el cliente");
    }
  };

  const editar = (cliente) => {
    setEdit(cliente._id);
    setF({ nombre: cliente.nombre || "", email: cliente.email || "", telefono: cliente.telefono || "", rfc: cliente.rfc || "" });
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-kicker">CRM comercial</div>
          <h2 className="page-title">Clientes</h2>
        </div>
        <span className="badge bg-info">{items.length} clientes</span>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel-grid">
        <form className="glass-card" onSubmit={guardar}>
          <h4 className="section-title">{edit ? "Editar cliente" : "Nuevo cliente"}</h4>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input className="form-control" placeholder="Ej. Juan Pérez" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input className="form-control" type="email" placeholder="cliente@correo.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input className="form-control" placeholder="667 000 0000" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">RFC</label>
              <input className="form-control" placeholder="RFC" value={f.rfc} onChange={(e) => setF({ ...f, rfc: e.target.value.toUpperCase() })} />
            </div>
          </div>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary">{edit ? "Actualizar cliente" : "Guardar cliente"}</button>
            {edit && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEdit(null); setF(initialForm); }}>Cancelar edición</button>}
          </div>
        </form>

        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
            <h4 className="section-title mb-0">Directorio</h4>
            <input className="form-control" style={{ maxWidth: 330 }} placeholder="Buscar cliente" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="table-shell">
            <table className="table">
              <thead><tr><th>Cliente</th><th>Email</th><th>Teléfono</th><th>RFC</th><th>Acciones</th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.nombre}</strong></td>
                    <td>{c.email || "—"}</td>
                    <td>{c.telefono || "—"}</td>
                    <td>{c.rfc || "—"}</td>
                    <td><button className="btn btn-warning btn-sm" onClick={() => editar(c)}>Editar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length && <div className="empty-state">No hay clientes para mostrar.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
