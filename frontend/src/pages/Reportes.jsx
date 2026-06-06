// Reportes con tarjetas, gráficas Chart.js y tabla de ventas mayores.
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import api from "../services/api";

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#475569" } },
  },
  scales: {
    x: { ticks: { color: "#64748b" }, grid: { color: "rgba(148,163,184,.16)" } },
    y: { ticks: { color: "#64748b" }, grid: { color: "rgba(148,163,184,.16)" } },
  },
};

export default function Reportes() {
  const [total, setTotal] = useState({});
  const [inv, setInv] = useState({ stockBajo: [] });
  const [dias, setDias] = useState([]);
  const [top, setTop] = useState([]);
  const [mayores, setMayores] = useState([]);

  useEffect(() => {
    api.get("/reportes/total-vendido").then((r) => setTotal(r.data || {}));
    api.get("/reportes/inventario").then((r) => setInv(r.data || { stockBajo: [] }));
    api.get("/reportes/ventas-por-fecha").then((r) => setDias(r.data || []));
    api.get("/reportes/productos-mas-vendidos").then((r) => setTop((r.data || []).slice(0, 5)));
    api.get("/reportes/ventas-mayores").then((r) => setMayores(r.data || []));
  }, []);

  const ventasPorDia = {
    labels: dias.map((d) => d._id),
    datasets: [{ label: "Ventas por día", data: dias.map((d) => d.totalDia), borderColor: "#2da56f", backgroundColor: "rgba(62,207,142,.14)", tension: 0.38 }],
  };

  const topProductos = {
    labels: top.map((p) => p.nombre),
    datasets: [{ label: "Unidades vendidas", data: top.map((p) => p.totalVendido), backgroundColor: "rgba(125,211,252,.45)", borderColor: "#38bdf8" }],
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-kicker">Business intelligence</div>
          <h2 className="page-title">Reportes</h2>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="card-icon">$</div>
          <div className="stat-label">Total vendido</div>
          <div className="stat-value">${Number(total.totalVendido || 0).toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="card-icon">#</div>
          <div className="stat-label">Número de ventas</div>
          <div className="stat-value">{total.numVentas || 0}</div>
        </div>
        <div className="stat-card">
          <div className="card-icon">!</div>
          <div className="stat-label">Productos con stock bajo</div>
          <div className="stat-value">{inv.stockBajo?.length || 0}</div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="chart-card">
            <h4 className="section-title">Ventas por fecha</h4>
            <div style={{ height: 280 }}><Line data={ventasPorDia} options={chartOptions} /></div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="chart-card">
            <h4 className="section-title">Top productos</h4>
            <div style={{ height: 280 }}><Bar data={topProductos} options={chartOptions} /></div>
          </div>
        </div>
      </div>

      <section className="glass-card">
        <h4 className="section-title">Ventas mayores a $10,000</h4>
        <div className="table-shell">
          <table className="table">
            <thead><tr><th>Folio</th><th>Cliente</th><th>Total</th></tr></thead>
            <tbody>
              {mayores.map((v) => (
                <tr key={v._id}>
                  <td><strong>{v.folio}</strong></td>
                  <td>{v.cliente?.nombre || "—"}</td>
                  <td>${Number(v.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!mayores.length && <div className="empty-state">No hay ventas mayores registradas.</div>}
        </div>
      </section>
    </div>
  );
}
