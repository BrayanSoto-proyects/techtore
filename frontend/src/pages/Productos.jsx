// Gestión de productos: listado, búsqueda, alta, edición y soft delete.
import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = { nombre: "", precio: 0, stock: 0, categoria: "Otro" };
const categorias = ["Electrónica", "Accesorios", "Computación", "Audio", "Gaming", "Otro"];

export default function Productos() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [f, setF] = useState(initialForm);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    const { data } = await api.get(`/productos?q=${encodeURIComponent(q)}`);
    setItems(data.productos || []);
  };

  useEffect(() => { cargar(); }, [q]);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      setError("");
      edit ? await api.put(`/productos/${edit}`, f) : await api.post("/productos", f);
      setF(initialForm);
      setEdit(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar el producto");
    }
  };

  const editar = (producto) => {
    setEdit(producto._id);
    setF({ nombre: producto.nombre || "", precio: producto.precio || 0, stock: producto.stock || 0, categoria: producto.categoria || "Otro" });
  };

  const cancelar = () => {
    setEdit(null);
    setF(initialForm);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-kicker">Inventario</div>
          <h2 className="page-title">Productos</h2>
        </div>
        <span className="badge bg-info">{items.length} registros</span>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel-grid">
        <form className="glass-card" onSubmit={guardar}>
          <h4 className="section-title">{edit ? "Editar producto" : "Nuevo producto"}</h4>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input className="form-control" placeholder="Ej. Laptop Pro 14" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} required />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Precio</label>
              <input className="form-control" type="number" min="0" step="0.01" value={f.precio} onChange={(e) => setF({ ...f, precio: Number(e.target.value) })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Stock</label>
              <input className="form-control" type="number" min="0" value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">Categoría</label>
            <select className="form-select" value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value })}>
              {categorias.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary">{edit ? "Actualizar producto" : "Agregar producto"}</button>
            {edit && <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>Cancelar edición</button>}
          </div>
        </form>

        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
            <h4 className="section-title mb-0">Catálogo</h4>
            <input className="form-control" style={{ maxWidth: 330 }} placeholder="Buscar por nombre o SKU" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="table-shell">
            <table className="table">
              <thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td><strong>{p.nombre}</strong></td>
                    <td>{p.sku || "—"}</td>
                    <td>{p.categoria}</td>
                    <td>${Number(p.precio).toFixed(2)}</td>
                    <td><span className={p.stock < 5 ? "badge bg-danger" : "badge bg-success"}>{p.stock}</span></td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={async () => { await api.delete(`/productos/${p._id}`); cargar(); }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length && <div className="empty-state">No hay productos para mostrar.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
