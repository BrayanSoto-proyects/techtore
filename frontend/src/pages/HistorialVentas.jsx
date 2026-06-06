// Historial de ventas con filtros por fecha y detalle desplegable.
import { useEffect, useState } from "react";
import api from "../services/api";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [f, setF] = useState({ inicio: "", fin: "" });
  const [sel, setSel] = useState(null);

  const cargar = async () => {
    const { data } = await api.get(`/ventas?inicio=${f.inicio}&fin=${f.fin}`);
    setVentas(data || []);
  };

  useEffect(() => { cargar(); }, []);

  const totalVentas = ventas.reduce((s, v) => s + Number(v.total || 0), 0);

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-kicker">Operaciones</div>
          <h2 className="page-title">Historial de ventas</h2>
        </div>
        <div className="text-end">
          <span className="stat-label">Total filtrado</span>
          <div className="stat-value">${totalVentas.toFixed(2)}</div>
        </div>
      </header>

      <div className="glass-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Fecha inicial</label>
            <input className="form-control" type="date" value={f.inicio} onChange={(e) => setF({ ...f, inicio: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Fecha final</label>
            <input className="form-control" type="date" value={f.fin} onChange={(e) => setF({ ...f, fin: e.target.value })} />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={cargar}>Filtrar ventas</button>
          </div>
        </div>
      </div>

      <div className="glass-card mb-4">
        <div className="table-shell">
          <table className="table">
            <thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v._id} onClick={() => setSel(v)} style={{ cursor: "pointer" }}>
                  <td><strong>{v.folio}</strong></td>
                  <td>{new Date(v.fecha).toLocaleDateString()}</td>
                  <td>{v.cliente?.nombre || "—"}</td>
                  <td>${Number(v.total).toFixed(2)}</td>
                  <td><span className="badge bg-success">{v.estado || "Completada"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!ventas.length && <div className="empty-state">No hay ventas con los filtros seleccionados.</div>}
        </div>
      </div>

      {sel && (
        <div className="detail-card">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <div className="page-kicker">Detalle</div>
              <h4 className="section-title mb-0">Venta {sel.folio}</h4>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSel(null)}>Cerrar</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><span className="stat-label">Cliente</span><div className="h5 mt-2">{sel.cliente?.nombre || "—"}</div></div>
            <div className="stat-card"><span className="stat-label">Vendedor</span><div className="h5 mt-2">{sel.vendedor?.nombre || "—"}</div></div>
            <div className="stat-card"><span className="stat-label">Fecha</span><div className="h5 mt-2">{new Date(sel.fecha).toLocaleDateString()}</div></div>
            <div className="stat-card"><span className="stat-label">Total</span><div className="h5 mt-2">${Number(sel.total).toFixed(2)}</div></div>
          </div>

          <h5 className="section-title">Productos vendidos</h5>
          <div className="table-shell">
            <table className="table">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
              <tbody>
                {sel.productos?.map((p, i) => (
                  <tr key={i}>
                    <td><strong>{p.nombre}</strong></td>
                    <td>{p.cantidad}</td>
                    <td>${Number(p.precioUnitario).toFixed(2)}</td>
                    <td>${Number(p.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
