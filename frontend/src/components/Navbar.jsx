// Barra de navegación principal con enlaces privados y cierre de sesión.
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Panel", icon: "⌁" },
  { to: "/productos", label: "Productos", icon: "▦" },
  { to: "/clientes", label: "Clientes", icon: "◉" },
  { to: "/ventas/nueva", label: "Nueva venta", icon: "+" },
  { to: "/ventas", label: "Historial", icon: "◌" },
  { to: "/reportes", label: "Reportes", icon: "◇" },
];

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="tech-sidebar">
      <Link className="tech-brand" to="/">
        <span className="brand-orb">T</span>
        <span>
          <strong>TechStore</strong>
        </span>
      </Link>

      <nav className="tech-menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `tech-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="avatar">{usuario?.nombre?.charAt(0) || "U"}</span>
          <div>
            <strong>{usuario?.nombre || "Usuario"}</strong>
            <small>{usuario?.rol || "sesión activa"}</small>
          </div>
        </div>
        <button className="btn btn-logout w-100" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
