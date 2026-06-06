// Panel inicial con resumen visual y accesos rápidos.
import { Link } from "react-router-dom";

const cards = [
  { to: "/productos", icon: "▦", title: "Productos" },
  { to: "/clientes", icon: "◉", title: "Clientes" },
  { to: "/ventas/nueva", icon: "+", title: "Nueva venta" },
  { to: "/ventas", icon: "◌", title: "Historial" },
  { to: "/reportes", icon: "◇", title: "Reportes" },
];

export default function Dashboard() {
  return (
    <div>
      <section className="hero-panel">
        <div className="page-kicker">Centro de control</div>
        <h1 className="page-title">Dashboard</h1>
      </section>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link className="dashboard-card" to={card.to} key={card.to}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>Abrir módulo</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
