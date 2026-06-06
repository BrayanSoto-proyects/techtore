// Creación de venta: selección de cliente, carrito, cálculo automático y ticket.
import { useEffect, useState } from "react";
import api from "../services/api";
import Ticket from "../components/Ticket";

export default function NuevaVenta() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodo] = useState("Efectivo");
  const [venta, setVenta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/clientes").then((r) => setClientes(r.data || []));
    api.get("/productos").then((r) => setProductos(r.data.productos || []));
  }, []);

  const agregar = (p) => {
    const existe = carrito.find((i) => i.producto === p._id);
    if (existe) {
      setCarrito(carrito.map((i) => i.producto === p._id ? { ...i, cantidad: i.cantidad + 1 } : i));
      return;
    }
    setCarrito([...carrito, { producto: p._id, nombre: p.nombre, cantidad: 1, precio: p.precio }]);
  };

  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const confirmar = async () => {
    try {
      setError("");
      const { data } = await api.post("/ventas", {
        cliente,
        metodoPago,
        productos: carrito.map((i) => ({ producto: i.producto, cantidad: i.cantidad })),
      });
      setVenta(data);
      setCarrito([]);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al crear venta");
    }
  };

  const cambiarCantidad = (idx, cantidad) => {
    const value = Math.max(1, Number(cantidad));
    setCarrito(carrito.map((x, j) => (j === idx ? { ...x, cantidad: value } : x)));
  };

  const quitar = (idx) => setCarrito(carrito.filter((_, j) => j !== idx));

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-kicker">Punto de venta</div>
          <h2 className="page-title">Nueva venta</h2>
        </div>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel-grid">
        <div className="glass-card">
          <h4 className="section-title">Datos de venta</h4>
          <label className="form-label">Cliente</label>
          <select className="form-select mb-3" value={cliente} onChange={(e) => setCliente(e.target.value)}>
            <option value="">Selecciona cliente</option>
            {clientes.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>

          <label className="form-label">Método de pago</label>
          <select className="form-select mb-4" value={metodoPago} onChange={(e) => setMetodo(e.target.value)}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </select>

          <div className="total-box mb-3">
            <span className="stat-label">Subtotal</span>
            <div>${subtotal.toFixed(2)}</div>
            <span className="stat-label">IVA 16%</span>
            <div>${iva.toFixed(2)}</div>
            <hr />
            <span className="stat-label">Total a pagar</span><br />
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button disabled={!cliente || !carrito.length} className="btn btn-success w-100" onClick={confirmar}>
            Confirmar venta
          </button>
        </div>

        <div className="glass-card">
          <div className="row g-4">
            <div className="col-xl-6">
              <h4 className="section-title">Productos disponibles</h4>
              <div className="product-picker">
                {productos.map((p) => (
                  <button key={p._id} className="product-tile" onClick={() => agregar(p)}>
                    <strong>{p.nombre}</strong>
                    <div className="product-price">${Number(p.precio).toFixed(2)}</div>
                    <small className="text-muted">Stock: {p.stock}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-xl-6">
              <h4 className="section-title">Carrito</h4>
              <div className="table-shell">
                <table className="table">
                  <thead><tr><th>Producto</th><th>Cant.</th><th>Importe</th><th></th></tr></thead>
                  <tbody>
                    {carrito.map((i, idx) => (
                      <tr key={`${i.producto}-${idx}`}>
                        <td><strong>{i.nombre}</strong><br /><small className="text-muted">${Number(i.precio).toFixed(2)} c/u</small></td>
                        <td><input className="form-control" style={{ width: 90 }} type="number" min="1" value={i.cantidad} onChange={(e) => cambiarCantidad(idx, e.target.value)} /></td>
                        <td>${(i.precio * i.cantidad).toFixed(2)}</td>
                        <td><button className="btn btn-sm btn-danger" onClick={() => quitar(idx)}>Quitar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!carrito.length && <div className="empty-state">Agrega productos para iniciar la venta.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticket venta={venta} />
    </div>
  );
}
