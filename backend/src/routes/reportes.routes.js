// Rutas de reportes: consultas Mongoose y agregaciones para indicadores de negocio.
import express from 'express';
import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';
import proteger from '../middleware/auth.js';
const router = express.Router();
router.use(proteger);

router.get('/total-vendido', async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const match = { estado: 'completada' };
    if (inicio || fin) match.fecha = { ...(inicio ? { $gte: new Date(inicio) } : {}), ...(fin ? { $lte: new Date(fin) } : {}) };
    const resultado = await Venta.aggregate([{ $match: match }, { $group: { _id: null, totalVendido: { $sum: '$total' }, numVentas: { $count: {} } } }]);
    res.json(resultado[0] || { totalVendido: 0, numVentas: 0 });
  } catch (error) { res.status(500).json({ mensaje: 'Error al calcular total vendido', error: error.message }); }
});

router.get('/productos-mas-vendidos', async (req, res) => {
  try { res.json(await Venta.aggregate([{ $match: { estado: 'completada' } }, { $unwind: '$productos' }, { $group: { _id: '$productos.producto', nombre: { $first: '$productos.nombre' }, totalVendido: { $sum: '$productos.cantidad' }, ingresoTotal: { $sum: '$productos.subtotal' } } }, { $sort: { totalVendido: -1 } }, { $limit: 10 }])); }
  catch (error) { res.status(500).json({ mensaje: 'Error al consultar productos más vendidos', error: error.message }); }
});

router.get('/ventas-por-fecha', async (req, res) => {
  try { res.json(await Venta.aggregate([{ $match: { estado: 'completada', fecha: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } }, totalDia: { $sum: '$total' }, numVentas: { $count: {} } } }, { $sort: { _id: 1 } }])); }
  catch (error) { res.status(500).json({ mensaje: 'Error al consultar ventas por fecha', error: error.message }); }
});

router.get('/inventario', async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    const stockBajo = await Producto.find({ stock: { $lt: 5 }, activo: true }).sort({ stock: 1 });
    const valorInventario = productos.reduce((sum, p) => sum + p.precio * p.stock, 0);
    res.json({ totalProductos: productos.length, stockBajo, valorInventario });
  } catch (error) { res.status(500).json({ mensaje: 'Error al consultar inventario', error: error.message }); }
});

router.get('/ventas-mayores', async (req, res) => {
  try { res.json(await Venta.find({ total: { $gt: 10000 }, estado: 'completada' }).populate('cliente', 'nombre email').populate('vendedor', 'nombre').sort({ total: -1 })); }
  catch (error) { res.status(500).json({ mensaje: 'Error al consultar ventas mayores', error: error.message }); }
});
export default router;
