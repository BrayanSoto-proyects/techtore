// Rutas de ventas: creación con validación de stock, consulta y cancelación con restauración.
import express from 'express';
import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';
import Cliente from '../models/Cliente.js';
import proteger from '../middleware/auth.js';
const router = express.Router();
router.use(proteger);

router.get('/', async (req, res) => {
  try {
    const { inicio, fin, cliente } = req.query;
    const filtro = {};
    if (cliente) filtro.cliente = cliente;
    if (inicio || fin) filtro.fecha = { ...(inicio ? { $gte: new Date(inicio) } : {}), ...(fin ? { $lte: new Date(fin) } : {}) };
    const ventas = await Venta.find(filtro).populate('cliente', 'nombre email').populate('vendedor', 'nombre').sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) { res.status(500).json({ mensaje: 'Error al listar ventas', error: error.message }); }
});

router.get('/:id', async (req, res) => { try { const v = await Venta.findById(req.params.id).populate('cliente').populate('vendedor', 'nombre email').populate('productos.producto'); if (!v) return res.status(404).json({ mensaje: 'Venta no encontrada' }); res.json(v); } catch (error) { res.status(500).json({ mensaje: 'Error al obtener venta', error: error.message }); } });

router.post('/', async (req, res) => {
  try {
    const { cliente, productos, metodoPago, notas } = req.body;
    if (!cliente || !Array.isArray(productos) || productos.length === 0 || !metodoPago) return res.status(400).json({ mensaje: 'Cliente, productos y método de pago son obligatorios' });
    if (!(await Cliente.findById(cliente))) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    const items = [];
    for (const item of productos) {
      const producto = await Producto.findOne({ _id: item.producto, activo: true });
      if (!producto) return res.status(404).json({ mensaje: `Producto no encontrado: ${item.producto}` });
      if (producto.stock < item.cantidad) return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      items.push({ producto: producto._id, nombre: producto.nombre, cantidad: item.cantidad, precioUnitario: producto.precio, subtotal: item.cantidad * producto.precio });
    }
    for (const item of items) await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
    const venta = await Venta.create({ cliente, vendedor: req.usuario._id, productos: items, metodoPago, notas });
    res.status(201).json(await venta.populate(['cliente', { path: 'vendedor', select: 'nombre email' }]));
  } catch (error) { res.status(500).json({ mensaje: 'Error al crear venta', error: error.message }); }
});

router.patch('/:id/cancelar', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    if (venta.estado === 'cancelada') return res.status(400).json({ mensaje: 'La venta ya estaba cancelada' });
    for (const item of venta.productos) await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: item.cantidad } });
    venta.estado = 'cancelada'; await venta.save();
    res.json({ mensaje: 'Venta cancelada y stock restaurado', venta });
  } catch (error) { res.status(500).json({ mensaje: 'Error al cancelar venta', error: error.message }); }
});
export default router;
