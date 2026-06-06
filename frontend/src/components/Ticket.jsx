// Ticket imprimible: muestra únicamente el comprobante de venta.
export default function Ticket({ venta }) {
  if (!venta) return null;

  const formatoMoneda = (valor = 0) =>
    Number(valor).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const imprimirComprobante = () => {
    window.print();
  };

  return (
    <section className="ticket receipt-only my-4">
      <div className="receipt-actions no-print">
        <button className="btn btn-primary" onClick={imprimirComprobante}>
          Imprimir comprobante
        </button>
      </div>

      <article className="receipt-card">
        <header className="receipt-header">
          <div className="receipt-logo">TechStore</div>
          <div className="receipt-subtitle">Comprobante de venta</div>
        </header>

        <div className="receipt-info">
          <div>
            <span>Folio</span>
            <strong>{venta.folio || '—'}</strong>
          </div>
          <div>
            <span>Fecha</span>
            <strong>{venta.fecha ? formatoFecha(venta.fecha) : '—'}</strong>
          </div>
          <div>
            <span>Cliente</span>
            <strong>{venta.cliente?.nombre || '—'}</strong>
          </div>
          <div>
            <span>Método de pago</span>
            <strong>{venta.metodoPago || '—'}</strong>
          </div>
        </div>

        <div className="receipt-table-wrap">
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {venta.productos?.map((p, index) => (
                <tr key={index}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>{formatoMoneda(p.precioUnitario)}</td>
                  <td>{formatoMoneda(p.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="receipt-totals">
          <div>
            <span>Subtotal</span>
            <strong>{formatoMoneda(venta.subtotal)}</strong>
          </div>
          <div>
            <span>IVA 16%</span>
            <strong>{formatoMoneda(venta.iva)}</strong>
          </div>
          <div className="receipt-total-row">
            <span>Total</span>
            <strong>{formatoMoneda(venta.total)}</strong>
          </div>
        </div>

        <footer className="receipt-footer">
          <p>Gracias por su compra.</p>
          <small>Conserve este comprobante para cualquier aclaración.</small>
        </footer>
      </article>
    </section>
  );
}
